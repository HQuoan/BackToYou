import styled from "styled-components";
import { HiEye, HiTrash } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteReport } from './useDeleteReport';

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;


function ReportRow({ report }) {
  const navigate = useNavigate();
  const {isLoading: isDeleting, deleteReport} = useDeleteReport();

  return (
    <Table.Row>
      <Stacked>
        <span>{report?.user.fullName}</span>
        <span>{report?.user.email}</span>
      </Stacked>

      <Tag type={report.title.toLowerCase()}>{report.title}</Tag>
      <p>{report.description}</p>
      <Tag type={report.status.toLowerCase()}>{report.status}</Tag>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={report.reportId} />
          <Menus.List id={report.reportId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/reports/${report.reportId}`)}
            >
              See details
            </Menus.Button>

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="reports"
              disabled={isDeleting}
              onConfirm={() => deleteReport(report.reportId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default ReportRow;
