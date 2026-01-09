/**
 * Composable for image error handling
 * Provides placeholder image and error handler
 */
export function useImageError() {
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e2e2e2' width='64' height='64'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = placeholderImage;
    }
  };

  return {
    placeholderImage,
    handleImageError,
  };
}
