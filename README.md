# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?
#Docker(Docker Error and no idea how to fix):
  - For Windows:
  
      Use wsl，then type  `docker build -t ct3a-docker --build-arg NEXT_PUBLIC_CLIENTVAR=clientvar .`
  
      When finish, can use docker desktop  or `docker run -p 3000:3000 -e DATABASE_URL="mysql://40dtru4343gywha47n6o:pscale_pw_1HrCI2iq8AxAhZjEVHoPhZ1Best9NSTqaNSAhpu2Rqq@aws.connect.psdb.cloud/soundware?sslaccept=strict" ct3a-docker`
  
      Then you can go to http://localhost:3000/
  
  - For Mac:

      No sure. Follow the similar steps above to see, I don't have a mac device to try. When you are done trying please help update it.

#Directly:
  - For Windows: 
  
      Use wsl, then type  `npm run dev` . Then you can go to http://localhost:3000/
  
  - For Mac:
  
      No sure. Follow the similar steps above to see, I don't have a mac device to try. When you are done trying please help update it.
