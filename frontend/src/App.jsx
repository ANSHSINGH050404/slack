import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function App() {
  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      
      <main>
        <SignedOut>
          <p>Please sign in to access the app</p>
        </SignedOut>
        <SignedIn>
          <p>Welcome! You're signed in.</p>
          {/* Your app content here */}
        </SignedIn>
      </main>
    </div>
  );
}