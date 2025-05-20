import styled from "styled-components";
import { Link } from "react-router-dom";

import Tag from "../../ui/Tag";
import Button from "../../ui/Button";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const PostInfo = styled.div`
  font-weight: 500;
`;

function TodayItem({ activity }) {
  const { slug, postStatus, postType, postLabel, title, location } =
    activity;

  // Map postStatus to tag type and corresponding color from GlobalStyles.js
  const statusToTagType = {
    Pending: "pending",
    Processing: "processing",
    Approved: "approved",
    Rejected: "rejected",
  };

  // Map postLabel to tag type for label display
  const labelToTagType = {
    Priority: "priority",
    Normal: "normal",
  };

  return (
    <StyledTodayItem>
      {/* Status Tag */}
      <Tag type={statusToTagType[postStatus] || "normal"}>{postStatus}</Tag>

      {/* Post Information */}
      <PostInfo>
        {title} ({postType}) - {location.streetAddress}, {location.ward},{" "}
        {location.district}, {location.province}
      </PostInfo>

      {/* Label Tag */}
      <Tag type={labelToTagType[postLabel] || "normal"}>{postLabel}</Tag>

      {/* Action Button */}
      {postStatus === "Pending" && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/posts/${slug}`}
        >
          View Details
        </Button>
      )}
      {postStatus === "Processing" && (
        <Button
          size="small"
          variation="secondary"
          as={Link}
          to={`/posts/${slug}`}
        >
          Update Status
        </Button>
      )}
      {postStatus === "Approved" && (
        <Button
          size="small"
          variation="success"
          as={Link}
          to={`/posts/${slug}`}
        >
          Mark Resolved
        </Button>
      )}
      {postStatus === "Rejected" && (
        <Button size="small" variation="danger" as={Link} to={`/posts/${slug}`}>
          Review
        </Button>
      )}
    </StyledTodayItem>
  );
}

export default TodayItem;
