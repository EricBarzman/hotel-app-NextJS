import { FC } from "react"
import { FaStar, FaStarHalf } from "react-icons/fa";

const Rating:FC<{ rating: number }> = ({ rating }) => {

  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const fullStarsElements = Array(fullStars).fill(<FaStar />);
  let halfStarElement = null;

  if (decimalPart > 0) halfStarElement = <FaStarHalf />;

  return (
    <>
        {fullStarsElements}
        {halfStarElement}
    </>
  )
}

export default Rating