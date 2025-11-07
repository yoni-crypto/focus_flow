# Landing Page Hero Image

## Current Setup

The landing page is currently using `/auth-bg.jpg` as the background image. For a better, more unique hero section, you can add a dedicated landing page image.

## Recommended Image

Add a file named `hero-bg.jpg` to the `/public` folder with the following characteristics:

### Specifications
- **Format**: JPG or PNG
- **Recommended size**: 1920x1080 or larger (landscape orientation)
- **Style**: Dark, minimal, elegant
- **Theme**: Productivity, focus, minimalism

### Image Content Suggestions
- Dark workspace setup
- Minimalist desk with productivity tools
- Abstract dark geometric patterns
- Dark cityscape or nature scene
- Clean, modern office space (dark theme)
- Minimalist product photography

### Image Sources
You can find suitable images on:
- **Unsplash**: Search "dark minimal productivity workspace", "dark minimalist background", "productivity desk dark"
- **Pexels**: Search "dark office workspace", "minimalist desk dark"
- **Pixabay**: Search "dark minimal background", "productivity dark"

### Alternative
If you want to use a different image, you can:
1. Add your image to `/public` folder
2. Update `app/page.tsx` to use your image filename in the backgroundImage URL

## Current Implementation

The landing page uses the same `auth-bg.jpg` image, which works well for consistency. If you want a unique hero image, replace the reference in `app/page.tsx` line 23 with your new image filename.

