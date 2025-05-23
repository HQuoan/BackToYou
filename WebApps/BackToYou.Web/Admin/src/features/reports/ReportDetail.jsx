import styled from "styled-components";
import { useParams } from "react-router-dom";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useReport } from "./useReport";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import ReportDataBox from "./ReportDataBox";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import PostDataBox from "../posts/PostDataBox";
import { usePostById } from "../posts/usePostById";
import { useState } from "react";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function ReportDetail() {
  const { id } = useParams();
  const { isLoading: isLoadingReport, report } = useReport(id);
  const moveBack = useMoveBack();
  const [showDetailPost, setShowDetailPost] = useState(false);

  const {
    isLoading: isLoadingPost,
    post,
  } = usePostById(report?.postId, showDetailPost); // chỉ fetch khi được bật

  if (isLoadingReport) return <Spinner />;
  if (!report) return <Empty resourceName="report" />;

  function handleShowPostDetail() {
    setShowDetailPost(true);
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Report #{id}</Heading>
          {/* <Tag type={report.status.toLowerCase()}>{report.status}</Tag> */}
        </HeadingGroup>
        <ButtonText onClick={moveBack}>← Back</ButtonText>
      </Row>

      <ReportDataBox report={report} />

      {showDetailPost && (isLoadingPost ? <Spinner /> : <PostDataBox post={post} />)}

      <ButtonGroup>
        {!showDetailPost && (
          <Button onClick={handleShowPostDetail}>Detail Post</Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default ReportDetail;
