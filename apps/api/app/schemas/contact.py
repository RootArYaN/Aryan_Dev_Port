from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    company: str | None = Field(default=None, max_length=120)
    subject: str = Field(min_length=3, max_length=140)
    message: str = Field(min_length=20, max_length=3000)
    website: str | None = Field(default=None, max_length=0)

    @field_validator("name", "company", "subject", "message", mode="before")
    @classmethod
    def strip_strings(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value


class ContactAccepted(BaseModel):
    message: str = "Message received"


class ContactAdminResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    company: str | None
    subject: str
    message: str
    created_at: str

    def to_camel(self) -> dict[str, str | None]:
        return {
            "id": self.id,
            "name": self.name,
            "email": str(self.email),
            "company": self.company,
            "subject": self.subject,
            "message": self.message,
            "createdAt": self.created_at,
        }
