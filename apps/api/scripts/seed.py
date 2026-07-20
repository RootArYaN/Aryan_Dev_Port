import asyncio

from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.project import Project

PROJECTS = [
    {
        "slug": "manufacturing-analytics-platform",
        "title": "Manufacturing Analytics Platform",
        "summary": "Near-live production data and reports in one clear tool.",
        "problem": "Large datasets and manual reports slowed daily decisions.",
        "solution": "SQL collects the data, Python checks it, and React shows the result.",
        "impact": "Millions of records now support fast, repeatable reports.",
        "tech_stack": ["SQL Server", "Python", "React", "Vite", "Uvicorn", "DuckDB"],
        "featured": True,
        "order_index": 1,
    },
    {
        "slug": "inventory-intelligence",
        "title": "Inventory and Overstock Analysis",
        "summary": "Tracks stock, movement, ageing, and work stages.",
        "problem": "Teams relied on repeated exports and separate spreadsheets.",
        "solution": "Automatic data updates, checked totals, filters, and simple trends.",
        "impact": "Moves most repeat work toward automation while people approve key actions.",
        "tech_stack": ["SQL Server", "Python", "React", "shadcn/ui", "Radix UI"],
        "featured": True,
        "order_index": 2,
    },
    {
        "slug": "sales-pricing-analytics",
        "title": "Sales & Pricing Analytics",
        "summary": "Shows sales trends, price changes, and simple what-if views.",
        "problem": "Static reports made price and sales comparisons slow.",
        "solution": "Fast web reports with saved results, filters, and clear steps.",
        "impact": "Teams can compare options faster and use the same numbers.",
        "tech_stack": ["SQL", "Python", "React", "Data validation", "Caching"],
        "featured": True,
        "order_index": 3,
    },
    {
        "slug": "report-automation",
        "title": "Report Automation",
        "summary": "Moves repeat Excel reports into a fast web tool.",
        "problem": "Each report took 30–45 minutes and the work repeated all day.",
        "solution": "Direct SQL queries, automatic updates, shared calculations, and clear pages.",
        "impact": "Makes 200–300 daily reports available in seconds.",
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
