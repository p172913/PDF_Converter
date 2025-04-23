FROM node:18

WORKDIR /frontend

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend project
COPY . .

# Expose Vite's dev port
EXPOSE 3001

# Run the dev server
CMD ["npm", "run", "dev"]