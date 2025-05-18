import styled from "styled-components";
import { format } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineMapPin,
} from "react-icons/hi2";
import DataItem from "../../ui/DataItem";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

const StyledPostDataBox = styled.section`
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
  padding: 3.2rem 4rem 1.2rem;
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

const Images = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 2.4rem;

  & img {
    width: 15rem;
    height: 15rem;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function PostDataBox({ post }) {
  const {
    createdAt,
    lostOrFoundDate,
    title,
    description,
    user: { fullName, email, avatar },
    category: { name: categoryName },
    location: { streetAddress, ward, district, province },
    postContact,
    postType,
    postLabel,
    postImages,
    rejectionReason,
    isEmbedded,
  } = post;

  return (
    <StyledPostDataBox>
      <Header>
        <div>
          <HiOutlineMapPin />
          <p>
            {postType} Item: <span>{categoryName}</span>
          </p>
        </div>
        <p>{format(new Date(lostOrFoundDate), "EEE, MMM dd yyyy, p")}</p>
      </Header>

      <Section>
        <User>
          {avatar && <img src={avatar} alt={`Avatar of ${fullName}`} />}
          <p>{fullName}</p>
          <span>•</span>
          <p>{email}</p>
        </User>

        <DataItem icon={<HiOutlineChatBubbleBottomCenterText />} label="Title">
          {title}
        </DataItem>

        <DataItem
          icon={<HiOutlineChatBubbleBottomCenterText />}
          label="Description"
        >
          {description}
        </DataItem>

        <DataItem icon={<HiOutlineMapPin />} label="Location">
          {streetAddress}, {ward}, {district}, {province}
        </DataItem>
        <DataItem icon={<HiOutlineMapPin />} label="Label">
          {postLabel} {rejectionReason}
        </DataItem>

        <DataItem
          icon={<HiOutlineChatBubbleBottomCenterText />}
          label="Contact Email"
        >
          {postContact.email}
        </DataItem>

        <DataItem
          icon={<HiOutlineChatBubbleBottomCenterText />}
          label="Trích xuất đặc trưng"
        >
          {isEmbedded ? "Đã trích xuất" : "Chưa trích xuất"}
        </DataItem>

         <DataItem
          icon={<HiOutlineChatBubbleBottomCenterText />}
          label="Lý do từ chối"
        >
          {rejectionReason}
        </DataItem>

        {postImages.length > 0 && (
          <Images>
            {postImages.map((img) => (
              <img key={img.postImageId} src={img.imageUrl} alt="Post item" />
            ))}
          </Images>
        )}
      </Section>

      <Footer>
        <p>Posted {format(new Date(createdAt), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledPostDataBox>
  );
}

export default PostDataBox;
