from fastapi import FastAPI
import PS
from Models import usuario
app = FastAPI()

@app.get("/datos")
def datos():
    usuarios  = PS.select()
    return usuarios

@app.post("/save")

def save (datos : usuario):
    print(datos.dict())
    return "recibido "


    
