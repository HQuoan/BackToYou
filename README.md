# Lost & Found AI Application

A modern online platform to help users post and search for lost or found items, integrated with AI for enhanced image and text-based search capabilities. Built with a microservices architecture, it leverages React, ASP.NET Core, Docker, and AI models like SentenceTransformer (CLIP-ViT-B-32) with FAISS for similarity search.

## Features
- **User Features**:
  - Register/login with email or third-party accounts (Google, Facebook).
  - Post, edit, or delete lost/found item listings with images, descriptions, and GPS locations.
  - AI-powered search by image or text description.
  - Comment, follow, and share posts on social media (e.g., Facebook).
  - Payment integration (VNPay, PayOS) for premium post prioritization.
  - GPS-based location filtering and map visualization.
  - User profile management and transaction history.

- **Admin Features**:
  - Dashboard with analytics (user count, posts, revenue).
  - Manage posts, categories, user roles, and reports.
  - Process AI embeddings for search functionality.

## Tech Stack
- **Frontend**: React, Bootstrap
- **Backend**: ASP.NET Core, Microservices, REST API, RabbitMQ, SignalR
- **Database**: SQL Server, SQLite (for AI embeddings)
- **AI**: SentenceTransformer (CLIP-ViT-B-32), FAISS
- **Deployment**: Docker, Google Colab, Ngrok
- **Version Control**: Git, GitHub

## Source
- Backend, AI: https://github.com/HQuoan/BackToYou
- Frontend: https://github.com/HQuoan/BackToYou_Web

## Microservices Application Flow Diagram
![Microservices Application Flow](media/Microservices_Application_Flow_Diagram.png)

## NGINX Application Flow Diagram
![NGINX Application Flow](media/NGINX_Application_Flow_Diagram.png)

## Database
![Database](media/database.png)
![Database](media/database2.png)

## Screenshots

### User Login Page
![User Login Page](media/login.png)

### Homepage
![Homepage](media/homepage.png)

### Categories
![Categories](media/categories.png)

### Latest Posts
![Latest Posts](media/latest_posts.png)

### Search Page
![Search Page](media/search.png)

### Post Map
![Post Map](media/latest_posts.png)

### AI Search
![AI Search](media/ai_search.png)

### Post Details
![Post Details](media/post_detail.png)

### Create Post
![Create Post](media/create_post.png)

### User Profile
![User Profile](media/user_profile.png)

### Wallet & Transaction History
![Wallet & Transaction History](media/wallet.png)

### Post History
![Post History](media/post_history.png)

### Admin Login Page
![Admin Login Page](media/admin_login.png)

### Admin Dashboard
![Admin Dashboard](media/dashboard.png)

### Admin Dashboard (Dark Mode)
![Admin Dashboard Dark Mode](media/dark_dashboard.png)

### Post Management
![Post Management](media/post_management.png)

### Post Processing
![Post Processing](media/post_processing.png)

### Report Management
![Report Management](media/report.png)

### User Management
![User Management](media/user.png)
### Admin Profile
![Admin Profile](media/admin_profile.png)


## API Documentation
- API endpoints are documented using Swagger/OpenAPI.
- AI Service endpoints: `/embedding`, `/delete_post_embeddings`, `/compare`.
