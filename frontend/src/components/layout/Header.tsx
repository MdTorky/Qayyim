import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, Heart, User, Search, Globe, LogOut, Settings, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const { items: wishlistItems, clearWishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const isAuthenticated = !!user;
  const isAdmin = user && user.isAdmin;

  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.shop },
    { href: "/products?gender=Men", label: t.nav.men },
    { href: "/products?gender=Women", label: t.nav.women },
    { href: "/products?sort=newest", label: t.nav.newArrivals },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 py-2 sm:py-3"
        : "bg-white border-b border-transparent py-4 sm:py-5"
        }`}
    >
      <div className="brand-container">
        <div className="flex items-center justify-between">

          {/* Mobile Menu Trigger & Logo (Left on Mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white">
                {/* Mobile Menu Header */}
                <div className="p-6 border-b bg-gray-50/50">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-black text-white text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg leading-tight">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-bold mb-2">Welcome</h2>
                      <div className="flex gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                          <Button className="w-full bg-black text-white hover:bg-gray-800">Sign In</Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                          <Button variant="outline" className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="flex flex-col">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-base font-medium text-gray-700 group-hover:text-black">
                          {link.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
                      </Link>
                    ))}

                    {isAuthenticated && (
                      <>
                        <div className="my-2 border-t mx-6 border-gray-100" />
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-base font-medium text-gray-700 group-hover:text-black">
                            {t.account.myAccount}
                          </span>
                          <User className="w-4 h-4 text-gray-400 group-hover:text-black" />
                        </Link>
                        <Link
                          to="/profile?tab=orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-base font-medium text-gray-700 group-hover:text-black">
                            {t.account.orders}
                          </span>
                          <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-black" />
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <div className="my-2 border-t mx-6 border-gray-100" />
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-base font-medium text-accent group-hover:text-accent/80">
                            {t.nav.admin}
                          </span>
                          <ChevronRight className="w-4 h-4 text-accent/50" />
                        </Link>
                      </>
                    )}
                  </nav>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t bg-gray-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{language === 'en' ? 'Language' : 'اللغة'}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-2"
                      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {language === 'en' ? 'Arabic' : 'English'}
                    </Button>
                  </div>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 px-0"
                      onClick={() => {
                        clearCart();
                        clearWishlist();
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo (Centered on mobile via absolute positioning usually, but here flex row) */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/Qayyim Logo.svg" alt="Qayyim" className="w-20 md:w-24" />
            </Link>
          </div>

          {/* Desktop Logo (Hidden on mobile to avoid dupe or keep structure simple) */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <img src="/Qayyim Logo.svg" alt="Qayyim" className="w-24" />
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors relative group py-2 ${location.pathname === link.href ? "text-black font-semibold" : "text-gray-600 hover:text-black"
                  }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                  />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black/50 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center"
                >
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.nav.search}
                      className="w-[180px] md:w-[250px] h-9 pr-8"
                      onBlur={() => !searchQuery && setSearchOpen(false)}
                    />
                    <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-9 w-9 text-gray-400 hover:text-black" type="submit">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="text-gray-700 hover:text-black hover:bg-gray-100/50">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </AnimatePresence>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="hidden md:flex text-gray-700 hover:text-black hover:bg-gray-100/50"
            >
              <span className="text-xs font-bold">{language === "en" ? "AR" : "EN"}</span>
            </Button>

            {/* Wishlist */}
            <Link to="/profile?tab=wishlist" className="relative hidden sm:block">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black hover:bg-gray-100/50">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black hover:bg-gray-100/50">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Desktop Account Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black hover:bg-gray-100/50">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 p-2 mb-2 bg-gray-50 rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          {t.account.myAccount}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile?tab=orders" className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          {t.account.orders}
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/admin/dashboard" className="flex items-center gap-2 text-accent">
                              <User className="w-4 h-4" />
                              {t.nav.admin}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          clearCart();
                          clearWishlist();
                          logout();
                        }}
                        className="text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.nav.logout}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <div className="grid gap-2 p-2">
                      <p className="text-xs text-muted-foreground text-center mb-1">Access your account</p>
                      <Link to="/login">
                        <Button size="sm" className="w-full bg-black text-white hover:bg-gray-800">
                          {t.nav.login}
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="sm" variant="outline" className="w-full">
                          {t.nav.signup}
                        </Button>
                      </Link>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
