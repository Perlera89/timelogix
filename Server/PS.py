import Conexion
import Models

def select ():

    dt = []
    
    cursor= Conexion.conexion.cursor()
    cursor.execute("select * from users")
    filas = cursor.fetchall()

    for items in filas:
        dt.append((Models.usuario(id=items[0],nombre=items[1]).dict()))
    
   
    return (dt) 



