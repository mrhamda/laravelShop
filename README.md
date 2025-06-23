Abdullah Hamdan – LaravelShop
This is a Laravel-based project I built to learn and explore the Laravel framework. It includes full authentication using Laravel Breeze, along with email verification upon registration.

Each user has a profile where they can upload an image and write a bio. They can update these details while logged in. Users can also post items for sale, and buyers can purchase them using PayPal integration. The payment goes to the website owner, and the user who sold the item can later collect the amount via PayPal.

Buyers provide a delivery address, and once they purchase an item, the app notifies them within the web application — helping avoid potential scams by giving buyers proof of purchase. Sellers can also edit or delete their own posts.

I originally intended to use the PostNord API for delivery time estimates and pickup location selection, but was unable to proceed as they delayed providing a secret API key.

The main focus was on learning Laravel and implementing the functionality, rather than UI/UX or visuals.

Features
Full user authentication using Laravel Breeze

Email verification on sign-up

User profile with editable bio and image

Item listing and purchase flow

PayPal integration for payments

In-app purchase notifications for proof

Editable/deletable posts

Tech Stack
Frontend:

React

Tailwind CSS

Backend & Services:

Laravel with Inertia.js

Laravel Breeze (for auth)

PayPal API
