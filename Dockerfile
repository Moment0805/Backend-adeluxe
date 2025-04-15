FROM node:22-alpine
 
 WORKDIR /app
 
 # Install app dependencies
 COPY package*.json ./
 
 RUN npm install
 
 # Copy Prisma files
 COPY prisma ./prisma
 RUN npx prisma generate
 
 # Copy the rest of the application code
 COPY . .
 
 ARG NODE_ENV
 ENV NODE_ENV=${NODE_ENV}
 
 ARG PORT
 ENV PORT=${PORT}
 
 ARG JWT_SECRET
 ENV JWT_SECRET=${JWT_SECRET}
 
 ARG DATABASE_URL
 ENV DATABASE_URL=${DATABASE_URL}
 
 ARG TWILIO_ACCOUNT_SID
 ENV TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
 
 ARG TWILIO_AUTH_TOKEN
 ENV TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
 
 ARG EMAIL_USER
 ENV EMAIL_USER=${EMAIL_USER}
 
 ARG EMAIL_PASS
 ENV EMAIL_PASS=${EMAIL_PASS}
 
 ARG TWILIO_PHONE_NUMBER
 ENV TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
 
 # Build the app
 RUN npm run build
 
 
 EXPOSE ${PORT}
 
 CMD ["node", "dist/main.js"]
