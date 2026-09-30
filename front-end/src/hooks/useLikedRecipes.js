import { useState } from "react";
import toast from "react-hot-toast";
import { toggleLike } from "../api/likes";

export function useLikedRecipes(initialLikedIds = []) {
  const [likedIds, setLikedIds] = useState(new Set(initialLikedIds));

  const handleToggleLike = async (id) => {
    try {
      await toggleLike(id);
      const wasLiked = likedIds.has(id);

      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(id);
        else next.add(id);
        return next;
      });

      toast.success(
        wasLiked ? "Removed from favorites" : "Added to favorites!",
      );
    } catch (err) {
      toast.error("Please log in to save recipes");
    }
  };

  return { likedIds, setLikedIds, handleToggleLike };
}
