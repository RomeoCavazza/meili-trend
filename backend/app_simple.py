from fastapi import FastAPI
import time

app = FastAPI(title="Insidr API Simple", version="2.0.0")

@app.on_event("startup")
def startup():
    print("🚀 Simple API starting up...")
    print("🎉 Simple API ready!")

@app.get("/")
def root():
    return {"message": "Simple API is running", "version": "2.0.0"}

@app.get("/ping")
def ping():
    return {"pong": True, "timestamp": int(time.time())}
