from fastapi import FastAPI
from pydantic import BaseModel
from g4f.client import Client
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
import asyncio

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Client()

class PromptRequest(BaseModel):
    prompt: str

class ChatRequest(BaseModel):
    messages: list

@app.post("/generate")
def generate_image(data: PromptRequest):
    try:
        response = client.images.generate(
            model="flux",
            prompt=data.prompt,
            response_format="url"
        )
        return {"url": response.data[0].url}
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat")
async def chat(data: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="deepseek-r1",
            messages=data.messages,
            web_search=False,
        )
        return response.choices[0].message.content
    except Exception as e:
        return {"error": str(e)}