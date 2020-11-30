import { 
  FaGithubSquare,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';


const Socials: React.FC<{}> = () => {

  return (
    <span>
      <FaTwitter />
      <FaLinkedin />
      <FaGithubSquare />
    </span>
  )
}

export default Socials