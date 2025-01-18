# NextPOS - Next.js Point of Sale System

A modern, web-based Point of Sale system built with Next.js, Tailwind CSS, Supabase, and TypeScript.

## Features

- 🛍️ Product Management
  - Add, edit, and delete products
  - Image upload support
  - Stock tracking
  - Active/Inactive status
  - Bulk import/export via CSV
  - Search functionality
  - Product categories

- 📦 Order Management
  - Create and manage orders
  - Order status tracking
  - Order history
  - Soft delete support

- 🎨 Modern UI
  - Responsive design
  - Clean and intuitive interface
  - Toast notifications
  - Loading states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Language**: TypeScript
- **State Management**: React Hooks
- **Data Export**: react-csv
- **Notifications**: react-toastify

## Getting Started

1. Clone the repository:
bash
git clone https://github.com/yourusername/nextpos.git
cd nextpos


2. Install dependencies:

bash
npm install


3. Set up environment variables:
Create a `.env.local` file in the root directory with the following:
env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_ke


4. Set up Supabase:
   - Create a new Supabase project
   - Create the following tables:
     - products
     - orders
   - Set up Storage bucket named 'products'

5. Run the development server:

bash
npm run dev


6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

nextpos/
├── app/
│ ├── dashboard/
│ │ ├── products/
│ │ │ ├── page.tsx
│ │ │ └── [productid]/
│ │ │ └── page.tsx
│ │ └── orders/
│ │ ├── page.tsx
│ │ └── [orderid]/
│ │ └── page.tsx
│ ├── page.tsx
│ └── layout.tsx
├── components/
│ └── ProductCard.tsx
├── models/
│ ├── Product.ts
│ └── Order.ts
├── lib/
│ └── supabaseClient.ts
├── public/
│ └── images/
└── styles/
└── globals.css

## Database Schema

### Products Table
create table products (
productId uuid default uuid_generate_v4() primary key,
name text not null,
description text,
price decimal(10,2) not null,
stockQuantity integer not null default 0,
active boolean default true,
imageUrl text
);


### Orders Table
create table orders (
order_id uuid default uuid_generate_v4() primary key,
product_id uuid references products(productId),
quantity integer not null,
total_price decimal(10,2) not null,
status text default 'pending'
);


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Geekstamatic](https://geekstamatic.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
