import asyncio

from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.project import Project

PROJECTS = [
    {
        "slug": "manufacturing-analytics-platform",
        "title": "Manufacturing Analytics Platform",
        "summary": "Near-live analytics spanning rough-to-polish production history, operational parameters, and management reporting.",
        "problem": "Large operational datasets and repeated manual analysis slowed management visibility and production decisions.",
        "solution": "Structured SQL retrieval, preprocessing, statistical comparisons, cached calculations, Python services, and React reporting workflows.",
        "impact": "Processes millions of records and converts repetitive reporting into reusable, fast internal applications.",
        "tech_stack": ["SQL Server", "Python", "React", "Vite", "Uvicorn", "DuckDB"],
        "featured": True,
        "order_index": 1,
    },
    {
        "slug": "inventory-intelligence",
        "title": "Inventory Intelligence & Overstock Analysis",
        "summary": "Tracks movement, stock position, overstock patterns, and operational throughput across manufacturing stages.",
        "problem": "Inventory decisions required repeated extracts, manual reconciliation, and fragmented spreadsheet reporting.",
        "solution": "Automated SQL refresh, validated calculations, interactive filters, trend views, and decision-support summaries.",
        "impact": "Moves the workflow toward 80–90% automation while retaining final human approval for critical actions.",
        "tech_stack": ["SQL Server", "Python", "React", "shadcn/ui", "Radix UI"],
        "featured": True,
        "order_index": 2,
    },
    {
        "slug": "sales-pricing-analytics",
        "title": "Sales & Pricing Analytics",
        "summary": "Explores sales trends, pricing behaviour, product parameters, and user-specific decision scenarios.",
        "problem": "Static reports made it difficult to test scenarios and compare historical patterns with current activity.",
        "solution": "Dynamic web reports with precomputed metrics, caching, filtering, and simplified user workflows.",
        "impact": "Faster scenario exploration and more consistent pricing and sales analysis for management discussions.",
        "tech_stack": ["SQL", "Python", "React", "Data validation", "Caching"],
        "featured": True,
        "order_index": 3,
    },
    {
        "slug": "report-automation",
        "title": "Report Automation & Excel-to-Web Migration",
        "summary": "Transforms repetitive Excel preparation into dynamic, refreshable web reporting tools.",
        "problem": "Teams spent 30–45 minutes compiling individual reports and repeated the workflow hundreds of times per day.",
        "solution": "Direct SQL querying, scheduled refresh, reusable backend calculations, and clear web interfaces.",
        "impact": "Reduced report generation from manual compilation to near-instant output for 200–300 daily reports.",
        "tech_stack": ["SQL Server", "Python", "React", "Excel", "APIs"],
        "featured": True,
        "order_index": 4,
    },
]


async def main() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session:
        for payload in PROJECTS:
            existing = await session.scalar(select(Project).where(Project.slug == payload["slug"]))
            if existing:
                for key, value in payload.items():
                    setattr(existing, key, value)
            else:
                session.add(Project(**payload))
        await session.commit()
    print(f"Seeded {len(PROJECTS)} portfolio projects")


if __name__ == "__main__":
    asyncio.run(main())
