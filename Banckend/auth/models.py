from pydantic import BaseModel
from typing import Optional

# Schema de RESPOSTA do login
class Token(BaseModel):
    access_token: str
    token_type: str

# Schema dos dados que vão DENTRO do token
class TokenData(BaseModel):
    email: Optional[str] = None