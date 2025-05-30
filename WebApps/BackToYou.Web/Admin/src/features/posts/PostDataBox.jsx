import styled from "styled-components";
import { format } from "date-fns";
import {
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineEnvelope,
  HiOutlineCog,
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import Tag from "../../ui/Tag";
import { formatVndCurrency } from "../../utils/helpers";
import { POST_TYPE_FOUND } from "./../../utils/constants";
import { useState } from "react";
import ImageModal from "../../ui/ImageModal";

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
  display: flex;
  flex-direction: row;
  padding: 3.2rem 4rem 1.2rem;
  gap: 2.4rem;
`;

const ContentColumn = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  /* gap: 0.5rem; */
`;

const ImagesColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;

  & img {
    width: 15rem;
    height: 15rem;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
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
    postStatus,
    price,
    postImages,
    rejectionReason,
    isEmbedded,
  } = post;

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <StyledPostDataBox>
        <Header>
          <div>
            <HiOutlineCube />
            <p>
              <Tag type={postType.toLowerCase()}>{postType}</Tag> Item:{" "}
              <span>{categoryName}</span>
            </p>
          </div>
          <Tag type={postStatus.toLowerCase()}>{postStatus}</Tag>
        </Header>

        <Section>
          <ContentColumn>
            <User>
              {avatar && <img src={avatar} alt={`Avatar of ${fullName}`} />}
              <p>{fullName}</p>
              <span>•</span>
              <p>{email}</p>
            </User>

            <DataItem icon={<HiOutlineDocumentText />} label="Title">
              {title}
            </DataItem>

            <DataItem icon={<HiOutlineDocument />} label="Description">
              {description}
            </DataItem>

            <DataItem icon={<HiOutlineMapPin />} label="Location">
              {streetAddress}, {ward}, {district}, {province}
            </DataItem>

            <DataItem icon={<HiOutlineTag />} label="Label">
              <Tag type={postLabel.toLowerCase()}>{postLabel}</Tag>
            </DataItem>

            <DataItem
              icon={<HiOutlineClock />}
              label={postType === POST_TYPE_FOUND ? "Found Date" : "Lost Date"}
            >
              {format(new Date(lostOrFoundDate), "EEE, MMM dd yyyy, p")}
            </DataItem>

            <DataItem icon={<HiOutlineCurrencyDollar />} label="Price">
              {formatVndCurrency(price)}
            </DataItem>

            <DataItem icon={<HiOutlineUser />} label="Contact Name">
              {postContact.name}
            </DataItem>

            <DataItem icon={<HiOutlinePhone />} label="Contact Phone">
              {postContact.phone}
            </DataItem>

            <DataItem icon={<HiOutlineEnvelope />} label="Contact Email">
              {postContact.email}
            </DataItem>

            {rejectionReason && (
              <DataItem
                icon={<HiOutlineExclamationCircle />}
                label="Rejection Reason"
              >
                {rejectionReason}
              </DataItem>
            )}

            <DataItem icon={<HiOutlineCog />} label="Embedding Status">
              {isEmbedded ? "Extracted" : "Not Extracted"}
            </DataItem>
          </ContentColumn>
          {postImages.length > 0 && (
            <ImagesColumn>
              {postImages.map((img) => (
                <img
                  key={img.postImageId}
                  src={img.imageUrl}
                  alt="Post item"
                  onClick={() => handleImageClick(img.imageUrl)}
                  style={{ cursor: "zoom-in" }}
                />
              ))}
            </ImagesColumn>
          )}
        </Section>

        <Footer>
          <p>Posted {format(new Date(createdAt), "EEE, MMM dd yyyy, p")}</p>
        </Footer>
      </StyledPostDataBox>

      <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
    </>
  );
}

export default PostDataBox;
