"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Home,
  Search,
  Plus,
  BookOpen,
  User,
  Menu,
  X,
  Shield,
  MessageCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthContext } from '@/components/auth-provider';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Sub2Directory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/search" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      <Search className="mr-2 h-4 w-4" />
                      Search Deals
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/education"
                          >
                            <BookOpen className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Education Center
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Learn about subject-to deals, risks, and best practices
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link href="/calculators" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Calculators</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ROI and payment calculators
                          </p>
                        </Link>
                        <Link href="/guides" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Step-by-step guides and templates
                          </p>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.user_metadata?.full_name?.split(' ').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ') || user.email}
                </span>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut} disabled={loading}>
                  Sign Out
                </Button>
                <Button asChild>
                  <Link href="/list-property">
                    <Plus className="mr-2 h-4 w-4" />
                    List Property
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <Plus className="mr-2 h-4 w-4" />
                    List Property
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/search" 
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  <span>Search Deals</span>
                </Link>
                <Link 
                  href="/education" 
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Education</span>
                </Link>
                <Link 
                  href="/calculators" 
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Calculators</span>
                </Link>
                <Link 
                  href="/guides" 
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Guides</span>
                </Link>
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="text-sm text-gray-600 mb-2">
                        Welcome, {user.user_metadata?.full_name?.split(' ').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ') || user.email}
                      </div>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        disabled={loading}
                      >
                        Sign Out
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/list-property" onClick={() => setIsOpen(false)}>
                          <Plus className="mr-2 h-4 w-4" />
                          List Property
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Plus className="mr-2 h-4 w-4" />
                          List Property
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}