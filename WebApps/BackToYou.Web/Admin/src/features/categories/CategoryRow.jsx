import styled from "styled-components";

import Table from "../../ui/Table";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  padding: 2px;
`;

const Category = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;


function CategoryRow({ category }) {
  const {
    name,
    slug,
    image,
  } = category;
 
  return (
    <Table.Row>
      <Img src={image} />
      <Category>{name}</Category>
      <Category>{slug}</Category>
    </Table.Row>
  );
}

export default CategoryRow;
