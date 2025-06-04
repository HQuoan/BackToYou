import styled from "styled-components";
import { Link, useParams } from "react-router-dom";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
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
import {
  POST_STATUS_APPROVED,
  POST_STATUS_PROCESSING,
  POST_STATUS_REJECTED,
} from "../../utils/constants";
import { useUpdateReportStatus } from "./useUpdateReportStatus";
import Modal from "../../ui/Modal";
import FormRowVertical from "../../ui/FormRowVertical";
import { useForm } from "react-hook-form";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Form from "../../ui/Form";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function ReportDetail() {
  const { id } = useParams();
  const { isLoading: isLoadingReport, report } = useReport(id);
  const moveBack = useMoveBack();
  // const [showDetailPost, setShowDetailPost] = useState(false);
  const { isLoading: isUpdating, updateReportStatus } = useUpdateReportStatus();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { isLoading: isLoadingPost, post } = usePostById(
    report?.postId
    // showDetailPost
  ); // chỉ fetch khi được bật

  const isActionLoading = isLoadingReport || isUpdating;

  if (isLoadingReport) return <Spinner />;
  if (!report) return <Empty resourceName="report" />;

  const { reportId, status } = report;

  // function handleShowPostDetail() {
  //   setShowDetailPost(true);
  // }

  function handleChangeReportStatus(status) {
    updateReportStatus({ reportId, status });
  }

  function handleReject({ reason }) {
    updateReportStatus({
      reportId,
      status: POST_STATUS_REJECTED,
      rejectionReason: reason,
    });
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

      <ButtonGroup>
        {report?.postId && (
          <Button>
            <Link to={`/posts/${post?.slug}`}>Detail Post</Link>
          </Button>
        )}

        {status !== POST_STATUS_PROCESSING && (
          <Button
            onClick={() => handleChangeReportStatus(POST_STATUS_PROCESSING)}
            disabled={isActionLoading}
          >
            Process
          </Button>
        )}

        {status === POST_STATUS_PROCESSING && (
          <>
            <Button
              variation="success"
              onClick={() => handleChangeReportStatus(POST_STATUS_APPROVED)}
              disabled={isActionLoading}
            >
              Approve
            </Button>

            <Modal>
              <Modal.Open opens="reject">
                <Button variation="danger" disabled={isActionLoading}>
                  Reject
                </Button>
              </Modal.Open>

              <Modal.Window name="reject">
                <Form onSubmit={handleSubmit(handleReject)}>
                  <FormRowVertical
                    label="Rejection Reason"
                    error={errors.reason?.message}
                  >
                    <Textarea
                      style={{ width: "500px", height: "200px" }}
                      rows={4}
                      placeholder="Please provide the reason for rejection..."
                      {...register("reason", {
                        required: "Reason is required",
                        minLength: {
                          value: 10,
                          message: "Reason must be at least 10 characters",
                        },
                      })}
                    />
                  </FormRowVertical>

                  <FormRow>
                    <Button
                      variation="danger"
                      disabled={isActionLoading}
                      type="submit"
                    >
                      {isActionLoading ? "Processing..." : "Confirm Reject"}
                    </Button>
                  </FormRow>
                </Form>
              </Modal.Window>
            </Modal>
          </>
        )}
      </ButtonGroup>
    </>
  );
}

export default ReportDetail;
