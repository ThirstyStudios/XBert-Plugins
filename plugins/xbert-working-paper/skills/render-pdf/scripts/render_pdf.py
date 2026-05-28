#!/usr/bin/env python3
"""Render an XBert working paper as a .pdf.

Modes:
  - --from-docx PATH    Convert an existing .docx via LibreOffice headless.
  - --payload PATH      Author from a structured payload via reportlab Platypus.

Both modes write the same single-line JSON result to stdout.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


def _emit(result: dict[str, Any], exit_code: int) -> None:
    print(json.dumps(result), flush=True)
    sys.exit(exit_code)


def _convert_via_soffice(docx_path: Path, out_path: Path) -> bool:
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        return False
    out_dir = out_path.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    try:
        subprocess.run(
            [
                soffice,
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                str(out_dir),
                str(docx_path),
            ],
            check=True,
            capture_output=True,
            timeout=120,
        )
    except Exception:  # noqa: BLE001
        return False

    produced = out_dir / (docx_path.stem + ".pdf")
    if produced.exists() and produced != out_path:
        produced.replace(out_path)
    return out_path.exists()


def _author_with_reportlab(payload: dict, out_path: Path) -> None:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        SimpleDocTemplate,
        Paragraph,
        Spacer,
        Table,
        TableStyle,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "XBertTitle",
        parent=styles["Title"],
        textColor=colors.HexColor("#1C1B41"),
        alignment=0,
        spaceAfter=8,
    )
    subtitle_style = ParagraphStyle(
        "XBertSubtitle",
        parent=styles["Italic"],
        textColor=colors.HexColor("#4E53BD"),
        spaceAfter=12,
    )
    body_style = styles["BodyText"]
    h1 = ParagraphStyle("XBertH1", parent=styles["Heading1"], textColor=colors.HexColor("#1C1B41"))
    h2 = ParagraphStyle("XBertH2", parent=styles["Heading2"], textColor=colors.HexColor("#1C1B41"))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
    )

    story: list = [Paragraph(payload.get("title", "XBert Working Paper"), title_style)]
    if payload.get("subtitle"):
        story.append(Paragraph(payload["subtitle"], subtitle_style))

    meta_bits = []
    for key, label in [
        ("tenant_name", "Tenant"),
        ("period", "Period"),
        ("check_reference_id", "Check reference"),
        ("prepared_by", "Prepared by"),
        ("prepared_at", "Prepared at"),
    ]:
        if payload.get(key):
            meta_bits.append(f"<b>{label}:</b> {payload[key]}")
    if meta_bits:
        story.append(Paragraph("<br/>".join(meta_bits), body_style))
        story.append(Spacer(1, 0.4 * cm))

    if payload.get("executive_summary"):
        story.append(Paragraph("Executive summary", h1))
        story.append(Paragraph(payload["executive_summary"], body_style))
        story.append(Spacer(1, 0.3 * cm))

    for section in payload.get("sections") or []:
        heading_text = section.get("heading") or "Section"
        if section.get("blocking"):
            heading_text = f"⚠ {heading_text} (blocking)"
        story.append(Paragraph(heading_text, h1))
        if section.get("body"):
            for paragraph in str(section["body"]).split("\n\n"):
                story.append(Paragraph(paragraph.strip(), body_style))
                story.append(Spacer(1, 0.15 * cm))
        table = section.get("table")
        if table and table.get("columns") and table.get("rows") is not None:
            data = [list(table["columns"])] + [list(row) for row in table["rows"]]
            t = Table(data, hAlign="LEFT")
            t.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1C1B41")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
                        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#9CA3BA")),
                    ]
                )
            )
            story.append(t)
            story.append(Spacer(1, 0.3 * cm))

    qms = payload.get("qms_block") or {}
    if qms:
        story.append(Paragraph("Quality management", h1))
        for key, label in [
            ("firm_name", "Firm"),
            ("preparer", "Preparer"),
            ("reviewer", "Reviewer"),
        ]:
            if qms.get(key):
                story.append(Paragraph(f"<b>{label}:</b> {qms[key]}", body_style))
        if qms.get("certification"):
            story.append(Paragraph(qms["certification"], body_style))

    for appendix in payload.get("appendix") or []:
        if appendix.get("heading"):
            story.append(Paragraph(appendix["heading"], h2))
        if appendix.get("body"):
            story.append(Paragraph(appendix["body"], body_style))

    doc.build(story)


def _page_count(out_path: Path) -> int:
    try:
        from pypdf import PdfReader

        reader = PdfReader(str(out_path))
        return len(reader.pages)
    except Exception:  # noqa: BLE001
        return 1 if out_path.exists() else 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Render an XBert working paper as .pdf")
    parser.add_argument("--from-docx", type=Path, help="Convert an existing .docx via LibreOffice")
    parser.add_argument("--payload", type=Path, help="Author from a payload via reportlab")
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()

    mode = None

    if args.from_docx and args.from_docx.exists():
        if _convert_via_soffice(args.from_docx, args.out):
            mode = "docx-convert"

    if mode is None and args.payload:
        if not args.payload.exists():
            _emit({"status": "errors_found", "error": f"payload not found: {args.payload}"}, 2)
        try:
            with args.payload.open("r", encoding="utf-8") as f:
                payload = json.load(f)
            _author_with_reportlab(payload, args.out)
            mode = "reportlab"
        except ModuleNotFoundError as exc:
            _emit(
                {
                    "status": "errors_found",
                    "error": f"missing dependency: {exc.name}. Install: pip install reportlab pypdf",
                },
                3,
            )
        except Exception as exc:  # noqa: BLE001
            _emit({"status": "errors_found", "error": f"{type(exc).__name__}: {exc}"}, 4)

    if mode is None:
        _emit(
            {
                "status": "errors_found",
                "error": (
                    "no PDF produced: either provide --from-docx with a valid .docx and "
                    "LibreOffice on PATH, or provide --payload with reportlab installed"
                ),
            },
            5,
        )

    result = {
        "path": str(args.out.resolve()),
        "exists": args.out.exists(),
        "size_bytes": args.out.stat().st_size if args.out.exists() else 0,
        "page_count": _page_count(args.out),
        "mode": mode,
        "status": "ok"
        if (args.out.exists() and args.out.stat().st_size > 1024)
        else "errors_found",
    }
    _emit(result, 0 if result["status"] == "ok" else 6)


if __name__ == "__main__":
    main()
