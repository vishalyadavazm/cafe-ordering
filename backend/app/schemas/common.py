"""Shared Pydantic base. Set from_attributes so schemas read ORM objects."""
from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
