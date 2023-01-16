import { IconType } from "react-icons";

interface ISocialIcon {
  Icon: IconType;
  name?: string;
  Wrapper?: any;
  title?: string;
  url?: string;
  handleClick?: () => void;
}

const TITLE = "Circle";
const URL = "https://ctf-frontendprod.aticloud.atican.dev";

const SocialIcon: React.FC<ISocialIcon> = ({
  Icon,
  name,
  Wrapper,
  title,
  url,
  handleClick,
}) => {
  return (
    <>
      {Wrapper ? (
        <Wrapper title={title} url={url}>
          <div
            className={`flex p-2 h-8 ${
              name ? "gap-2 items-center" : "w-8"
            } shadow-md bg-white rounded-full cursor-pointer`}>
            <Icon />
            {name && <span className="capitalize font-medium">{name}</span>}
          </div>
        </Wrapper>
      ) : (
        <div
          onClick={handleClick}
          className={`flex p-2 h-8 ${
            name ? "gap-2 items-center" : "w-8"
          } shadow-md bg-white rounded-full cursor-pointer`}>
          <Icon />
          {name && <span className="capitalize font-medium">{name}</span>}
        </div>
      )}
    </>
  );
};

export default SocialIcon;
