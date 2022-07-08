import { useState } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import Link from 'next/link';

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  const url = "https://api-ap-south-1.graphcms.com/v2/cl4zpu6kz0ef401ug6n479iah/master";

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTY1OTMwNTIsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDR6cHU2a3owZWY0MDF1ZzZuNDc5aWFoL21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6IjM3NTVlNWI5LWI5MjUtNGNjMS05ODVkLWE2MThmZmRkNGZmNCIsImp0aSI6ImNsNTEwcWNiaTFhdjQwMXVlNzV1ZTV1dGcifQ.sqeiZKIQc57walZ2PHtONS9g6TGfmVY3ciebYaxrRlGyrwRvsfmKO-H9MFNib2yErxV_eFTsYx2Z8zlU3pc6Xvuzez6nMqIA3Uz6wW3wLYf6N3r4nWE0CD8vcQm12VwFbR882XGLlhMNfHwkzZF2KZ8_eRvzS_SxFNpUWFn4ZsQgjiykGQ2yp7a-_Xewj-uL63C6poQP88ypU_9UmuMKIVXl5ugaVHdkE97JlS-E6WGKsf0zIW4DUv6sMB_itG7py6KYy7Tr5SKpn4z1-3VHJogk1LONkWjUXAr8gUzSiUbnrF9aCPd9Ga1Rbe7DDf2azxmv0Iy9T2ejj78JgVZ7ihQR-rvM2646-zmmWoUw1jdBclVvVu9F_3-DR5KWQcid7MYwqqSNlDq9z-3czk9KaOjHCB9NwHBBra1BtK_UxIoYGei5IkII_UefNQ_6Q6nVc6MU4_VJ5ooh6cS02sJGtkGHL2EjcdMys9R2me0x4pXhi0vXP1aBTLYVuluyTpFPbV-Sfz0ePZhUpO9Ev7g_VcvB_zOknIwmT75AiN3Z0M3NtU5A84BfmrfDAEAVC5raQypPiX_r6TQCoBT2YGTx8ql1NQitjJs5mpVnEwtmqjRBPM41PIoOPH37rGS9VGMRK1mUaGHVYEP-y36z9QEWljTiCnR_77s-sIIh_l1GIh0"
    }
  })

  const query = gql`
    query($pageSlug: String!) {
        video(where: {
          slug: $pageSlug
        }) {
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

  const data = await graphQLClient.request(query, { pageSlug });
  const video = data.video;

  return {
    props: {
      video
    }
  }
}

const chnageToSeen = async (slug) => {
  await fetch('/api/changeToSeen',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ slug })
  })
}

const Video = ({ video }) => {
  const [watching, setWatching] = useState(false);
  return (<>
    {!watching &&
      (
        <>
          <img className='video-image'
            src={video.thumbnail.url}
            alt={video.title}
          />

          <div className='info'>
            <p>{video.tags.join(', ')}</p>
            <p>{video.description}</p>
            <Link href='/'><p>go back</p></Link>
            <button
              className='video-overlay'
              onClick={() => {
                chnageToSeen(video.slug)
                setWatching(!watching)}
              }
            >
              Play
            </button>
          </div>
        </>
      )
    }
    {watching && (
      <video width="100%" controls>
        <source src={video.mp4.url} type="video/mp4" />
      </video>
    )}
    <div className='info-footer'
          onClick={() => watching ? setWatching(false) : null}
    ></div>
  </>)
}

export default Video;