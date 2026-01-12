import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { type Product } from "../types";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import { toast } from "@/hooks/use-toast";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [items, setItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch wishlist from API when user logs in
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const { data } = await api.get("/users/wishlist");
          setItems(data);
          localStorage.setItem("wishlist", JSON.stringify(data));
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      };
      fetchWishlist();
    } else {
      // If logout, maybe clear or keep? Keeping for now, standard behavior usually clears or keeps local.
      // Let's rely on local storage for non-auth.
      const saved = localStorage.getItem("wishlist");
      if (saved) setItems(JSON.parse(saved));
    }
  }, [user]);

  // Sync to local storage whenever items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const toggleItem = async (product: Product) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "تسجيل الدخول مطلوب" : "Login Required",
        description: language === "ar" ? "يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة" : "Please login to add items to wishlist",
      });
      return;
    }

    const pId = product._id || product.id;

    // Optimistic Update
    const exists = items.some((item) => (item._id || item.id) === pId);
    let newItems: Product[];

    if (exists) {
      newItems = items.filter((item) => (item._id || item.id) !== pId);
    } else {
      newItems = [...items, product];
    }

    setItems(newItems);

    if (user) {
      try {
        await api.post("/users/wishlist", { productId: pId });
        // Optionally fetch fresh list to be sure, but optimistic is faster
        // const { data } = await api.get("/users/wishlist");
        // setItems(data);
      } catch (error) {
        console.error("Failed to sync wishlist", error);
        // Revert on error
        setItems(items);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update wishlist",
        });
      }
    }
  };

  const addItem = (product: Product) => {
    const pId = product._id || product.id;
    if (!items.some((item) => (item._id || item.id) === pId)) {
      toggleItem(product);
    }
  };

  const removeItem = (productId: string) => {
    const item = items.find((i) => (i._id || i.id) === productId);
    if (item) {
      toggleItem(item);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => (item._id || item.id) === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem("wishlist");
  };

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

