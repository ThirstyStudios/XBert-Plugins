"""Tests for the render_docx currency-corruption guard (#9).

Covers SC-4: render_docx.py must reject a shell-corrupted payload (the real
Bayside STP-FY2026 corruption) and still render a clean payload with the
`$`-prefixed amounts intact.

Run: pytest scripts/test_render_docx.py   (needs python-docx)
"""

from __future__ import annotations

import json
import subprocess
import sys
import zipfile
from pathlib import Path

import pytest

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import render_docx  # noqa: E402


def _stp_payload(*, corrupt: bool) -> dict:
    """The Bayside STP finalisation working paper — clean, or shell-corrupted
    exactly as the reported docx was ($0.00->/bin/sh.00, $80,977.16->0,977.16,
    $8,834.71->,834.71, $0 gross->/bin/sh gross)."""
    if corrupt:
        summary = "Total payroll: 0,977.16 gross, 0,854.00 PAYG withheld, ,834.71 super guarantee."
        body = "Pass - /bin/sh.00 ETP and lump sum"
        rows = [["Anthony Tranter", "/bin/sh gross", "17.42 super"], ["Total", "0,977.16", ",834.71"]]
        cert = "/bin/sh.00 - RECONCILED"
    else:
        summary = "Total payroll: $80,977.16 gross, $80,854.00 PAYG withheld, $8,834.71 super guarantee."
        body = "Pass - $0.00 ETP and lump sum"
        rows = [["Anthony Tranter", "$0.00 gross", "$117.42 super"], ["Total", "$80,977.16", "$8,834.71"]]
        cert = "$0.00 - RECONCILED"
    return {
        "check_reference_id": "STP-FY2026-121367-002",
        "plugin": "xbert-stp-finalisation",
        "tenant_name": "Bayside Community Radio Association Inc",
        "period": "FY2025/2026",
        "title": "STP Finalisation Review",
        "executive_summary": summary,
        "sections": [
            {
                "heading": "Reconciliation",
                "body": body,
                "table": {"columns": ["Employee", "Gross", "Super"], "rows": rows},
            }
        ],
        "qms_block": {"firm_name": "XBert Test Firm", "preparer": "Bookkeeper", "certification": cert},
    }


# --- Unit: the detector -----------------------------------------------------

def test_detector_passes_clean_payload():
    assert render_docx._detect_currency_corruption(_stp_payload(corrupt=False)) == []


def test_detector_flags_corrupt_payload():
    hits = render_docx._detect_currency_corruption(_stp_payload(corrupt=True))
    assert hits, "corrupted payload must be flagged"
    flagged = {h["value"] for h in hits}
    # the /bin/sh values and the malformed-number values are all caught
    assert any("/bin/sh" in v for v in flagged)
    assert any(v.strip().startswith(",") or v.strip().startswith("0,") for v in flagged)


@pytest.mark.parametrize(
    "amount",
    ["$80,977.16", "$8,834.71", "$0.00", "$0", "$1,000.00", "$10,854.00", "$1,402.15", "1-1110", "2-3100"],
)
def test_detector_no_false_positive_on_valid_amounts(amount):
    assert render_docx._detect_currency_corruption({"v": amount}) == []


@pytest.mark.parametrize("bad", ["/bin/sh.00", "0,977.16", ",834.71", "0,854.00", "/bin/sh gross"])
def test_detector_catches_each_corruption_form(bad):
    assert render_docx._detect_currency_corruption({"v": bad})


# --- Integration: the real CLI call path ------------------------------------

def _run(payload: dict, tmp_path: Path) -> tuple[int, dict]:
    pj = tmp_path / "payload.json"
    pj.write_text(json.dumps(payload), encoding="utf-8")
    out = tmp_path / "working-paper.docx"
    proc = subprocess.run(
        [sys.executable, str(SCRIPT_DIR / "render_docx.py"), "--payload", str(pj), "--out", str(out)],
        capture_output=True, text=True,
    )
    last = [ln for ln in proc.stdout.splitlines() if ln.strip()][-1]
    return proc.returncode, json.loads(last), out


def test_cli_rejects_corrupt_payload(tmp_path):
    code, result, out = _run(_stp_payload(corrupt=True), tmp_path)
    assert code != 0
    assert result["status"] == "corrupted_payload"
    assert result["corrupted_count"] >= 1
    assert not out.exists(), "must NOT write a docx from a corrupted payload"


def test_cli_renders_clean_payload_with_amounts_intact(tmp_path):
    code, result, out = _run(_stp_payload(corrupt=False), tmp_path)
    assert code == 0, result
    assert result["status"] == "ok"
    assert result["opens_cleanly"] is True
    # the $-amounts must survive verbatim into the document
    with zipfile.ZipFile(out) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    assert "$80,977.16" in xml
    assert "$0.00" in xml
    assert "/bin/sh" not in xml
