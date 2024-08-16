This is a stripped-down version of an online event platform used to network with other people in the event and to view an online stream among other event-related information. Works as a PWA on mobile, but can be checked with a desktop browser and that's even recommended.

## This is a work-in-progress

This is not a finalized product in any way, but rather a first (hurried up) version with very basic functionalities. No tests, no other fancy stuff. Code could certainly use some refactoring and cleaning up, but it works just fine.

JWT's are stored in local storage (and not expiring), but it's known that it would be better to handle them more securily with a cookie – not doing it for the sake of this review.

## Try this example platform out

You can try out this platform at https://event-platform-rho-ten.vercel.app/event24?code=TYEZXYUP. If needed, you can log in with the code TYEZXYUP.

## Tech stack keywords
- Next.js (not utilizing the SSR tools because of the real deployment environment of this app)
- TypeScript
- Tailwind CSS
- Headless UI