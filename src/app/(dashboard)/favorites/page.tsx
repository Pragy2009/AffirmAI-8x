import { getFavorites } from '@/actions/favorites';
import { FavoritesList } from '@/features/favorites/favorites-list';

export const metadata = {
  title: 'Favorites',
};

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Favorites ❤️
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {favorites.length} saved affirmation{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FavoritesList favorites={favorites as any} />
    </div>
  );
}
