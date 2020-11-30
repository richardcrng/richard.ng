import { 
  FaGithubSquare,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';


const socials: [IconType, string][] = [
  [FaTwitter, 'https://twitter.com/richardcrng'],
  [FaLinkedin, 'https://www.linkedin.com/in/richardcrng/'],
  [FaGithubSquare, 'https://github.com/richardcrng/']
]

const Socials: React.FC<{}> = () => {

  return (
    <span>
      {socials.map(([Icon, href]) => (
        <a
          key={href}
          href={href}
          target='_blank'
          style={{
            marginLeft: '5px'
          }}
        >
          <Icon size={24} />
        </a>
      ))}
    </span>
  )
}

export default Socials