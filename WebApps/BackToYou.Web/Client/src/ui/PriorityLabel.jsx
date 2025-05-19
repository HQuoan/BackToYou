import { POST_LABEL_PRIORITY } from "../utils/constants";

function PriorityLabel({postLabel}) {
  return (  postLabel === POST_LABEL_PRIORITY &&
      <span className="post-label-block">Tin ưu tiên</span>
  );
}

export default PriorityLabel;
