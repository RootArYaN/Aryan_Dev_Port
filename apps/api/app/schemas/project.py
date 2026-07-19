from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", min_length=3, max_length=120)
    title: str = Field(min_length=3, max_length=180)
    summary: str = Field(min_length=20, max_length=1000)
    problem: str = Field(min_length=20, max_length=3000)
    solution: str = Field(min_length=20, max_length=3000)
    impact: str = Field(min_length=10, max_length=2000)
    tech_stack: list[str] = Field(default_factory=list, max_length=20)
    featured: bool = False
    published: bool = True
    order_index: int = Field(default=0, ge=0, le=10000)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: str

    def to_camel(self) -> dict[str, object]:
        data = self.model_dump()
        data["techStack"] = data.pop("tech_stack")
        data["orderIndex"] = data.pop("order_index")
        return data
