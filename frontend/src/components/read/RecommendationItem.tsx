import { NavLink } from "react-router-dom";

type RecommendationItemProps = {
  id: number;
  title: string;
  desc: string;
  thumbnail: string;
};

export default function RecommendationItem({
  id,
  title,
  desc,
  thumbnail,
}: RecommendationItemProps) {
  return (
    <li>
      <NavLink to={`/read/${id}`}>
        <article className="page__recommend-list">
          <img
            src={thumbnail}
            alt="related-thumbnail"
            className="page__recommend-img"
          />
          <div>
            <h4 className="page__recommend-subtitle">{title}</h4>
            <p className="page__recommend-desc">{desc}</p>
          </div>
        </article>
      </NavLink>
    </li>
  );
}
