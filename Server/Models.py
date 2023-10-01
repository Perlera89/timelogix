from pydantic import BaseModel
from typing import Optional, Text
class usuario(BaseModel):

    id:Optional[int]
    nombre:str

class fechas ():    
    id:Optional[int]