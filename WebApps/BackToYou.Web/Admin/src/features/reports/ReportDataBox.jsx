import styled from "styled-components";
import { format } from "date-fns";
import {
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineClock,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import Tag from "../../ui/Tag";

const StyledReportDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 3.2rem 4rem 1.2rem;
  gap: 2.4rem;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }

  & img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function ReportDataBox({ report }) {
  const {
    reportId,
    postId,
    title,
    description,
    status,
    rejectionReason,
    createdAt,
    lastModified,
    user: { fullName, email, phoneNumber, avatar },
  } = report;

  return (
    <StyledReportDataBox>
      <Header>
        <div>
          <HiOutlineIdentification />
          <p>
            Title: <Tag type={title.toLowerCase()}>{title}</Tag>
          </p>
        </div>
        <Tag type={status.toLowerCase()}>{status}</Tag>
      </Header>

      <Section>
        <User>
          {avatar && <img src={avatar} alt={`Avatar of ${fullName}`} />}
          <p>{fullName}</p>
          <span>•</span>
          <p>{email}</p>
        </User>

        <DataItem icon={<HiOutlineDocument />} label="Description">
          {description}
        </DataItem>

        {postId && (
          <DataItem icon={<HiOutlineIdentification />} label="Related Post ID">
            {postId}
          </DataItem>
        )}

        {rejectionReason && (
          <DataItem
            icon={<HiOutlineExclamationCircle />}
            label="Rejection Reason"
          >
            {rejectionReason}
          </DataItem>
        )}

        <DataItem icon={<HiOutlinePhone />} label="Phone">
          {phoneNumber || "—"}
        </DataItem>
      </Section>

      <Footer>
        <span>Posted {format(new Date(createdAt), "EEE, MMM dd yyyy, p")}</span>
      </Footer>
    </StyledReportDataBox>
  );
}

export default ReportDataBox;
