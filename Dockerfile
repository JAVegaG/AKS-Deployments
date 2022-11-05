FROM python:3.8-buster AS model-builder

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY model.py .

RUN python model.py

RUN tensorflowjs_converter --input_format keras 'model.h5' 'model'

#---

FROM node:lts-alpine AS deploy

WORKDIR /deployment

COPY ["app/package.json", "app/package-lock.json", "./"]

RUN npm install

COPY app/ .

COPY --from=model-builder /app/model ./public/model

EXPOSE 3000

CMD ["node", "index.js"]

# ---