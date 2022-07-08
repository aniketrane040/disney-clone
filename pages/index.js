import { gql, GraphQLClient } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Section from '../components/Section';

export const getStaticProps = async () => {
  const url = "https://api-ap-south-1.graphcms.com/v2/cl4zpu6kz0ef401ug6n479iah/master";

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTY1OTMwNTIsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDR6cHU2a3owZWY0MDF1ZzZuNDc5aWFoL21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6IjM3NTVlNWI5LWI5MjUtNGNjMS05ODVkLWE2MThmZmRkNGZmNCIsImp0aSI6ImNsNTEwcWNiaTFhdjQwMXVlNzV1ZTV1dGcifQ.sqeiZKIQc57walZ2PHtONS9g6TGfmVY3ciebYaxrRlGyrwRvsfmKO-H9MFNib2yErxV_eFTsYx2Z8zlU3pc6Xvuzez6nMqIA3Uz6wW3wLYf6N3r4nWE0CD8vcQm12VwFbR882XGLlhMNfHwkzZF2KZ8_eRvzS_SxFNpUWFn4ZsQgjiykGQ2yp7a-_Xewj-uL63C6poQP88ypU_9UmuMKIVXl5ugaVHdkE97JlS-E6WGKsf0zIW4DUv6sMB_itG7py6KYy7Tr5SKpn4z1-3VHJogk1LONkWjUXAr8gUzSiUbnrF9aCPd9Ga1Rbe7DDf2azxmv0Iy9T2ejj78JgVZ7ihQR-rvM2646-zmmWoUw1jdBclVvVu9F_3-DR5KWQcid7MYwqqSNlDq9z-3czk9KaOjHCB9NwHBBra1BtK_UxIoYGei5IkII_UefNQ_6Q6nVc6MU4_VJ5ooh6cS02sJGtkGHL2EjcdMys9R2me0x4pXhi0vXP1aBTLYVuluyTpFPbV-Sfz0ePZhUpO9Ev7g_VcvB_zOknIwmT75AiN3Z0M3NtU5A84BfmrfDAEAVC5raQypPiX_r6TQCoBT2YGTx8ql1NQitjJs5mpVnEwtmqjRBPM41PIoOPH37rGS9VGMRK1mUaGHVYEP-y36z9QEWljTiCnR_77s-sIIh_l1GIh0"
    }
  })

  const videosQuery = gql`
      query {
        videos {
          createdAt,
          id,
          title,
          description,
          seen,
          slug,
          tags,
          thumbnail {
            url
          }
          mp4 {
            url
          }
        }
      }
      `

  const accountQuery = gql`
      query {
        account(where: { id: "cl50yd3hs0sld0co48ik1lviy"}) {
          username,
          avatar {
            url
          }
        }
      }
  `

  const data = await graphQLClient.request(videosQuery);
  const videos = data.videos;

  const accountData = await graphQLClient.request(accountQuery);
  const account = accountData.account

  return {
    props: {
      videos,
      account
    }
  }
}
const Home = ({ videos , account }) => {
  
  const randomVideos = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  }

  const unSeenVideos = (videos) => {
    return videos.filter((video) => video.seen == false || video.seen == null)
  }

  return (
    <>
      <NavBar account={account} />
      <div className='app'>
        <div className='main-video'>
          <img 
            src={randomVideos(videos).thumbnail.url}
            alt={randomVideos(videos).title} 
          />
        </div>
      </div>
      <div className='video-feed'> 
        <Link href='#disney'><div className='franchise' id='disney'></div></Link>
        <Link href='#marvel'><div className='franchise' id='marvel'></div></Link>
        <Link href='#action'><div className='franchise' id='action'></div></Link>
        <Link href='#family'><div className='franchise' id='family'></div></Link>
        <Link href='#thriller'><div className='franchise' id='thriller'></div></Link>
        </div>
        <Section genre={"Recommended for you"} videos={unSeenVideos(videos)} />
        <Section id='family' genre={"Family"} videos={filterVideos(videos,'family')} />
        <Section id='marvel' genre={"Marvel"} videos={filterVideos(videos,'marvel')}/>
        <Section id='action' genre={"Action"} videos={filterVideos(videos,'Action')}/>
        <Section id='thriller' genre={"Thriller"} videos={filterVideos(videos,'Thriller')}/>
        <Section id='disney' genre={"Disney"} videos={filterVideos(videos,'Disney')}/>
        <Section genre={"Horror"} videos={filterVideos(videos,'Horror')}/>
      
    </>
  )
}

export default Home