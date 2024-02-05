import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCheckpointsByPlanId } from '../../../store/actions/checkpointActions';
import { valueChange } from '../../../store/actions';

function DeletCheckpointPlanCheckbox(props) {
  const { dispatch, options, jobs } = props;
  const { id } = options;
  const [remove, setRemove] = useState(false);
  const { vmCheckpoint } = jobs;
  const isRecoveryCheckpointEnabled = vmCheckpoint.length > 0;

  useEffect(() => {
    dispatch(fetchCheckpointsByPlanId(id));
  }, []);

  const handleChange = (e) => {
    setRemove(e.target.checked);
    dispatch(valueChange(`${id}-delete-checkpoints`, e.target.checked));
  };

  const { t } = props;
  return (
    <>

      {isRecoveryCheckpointEnabled ? (
        <>
          <div className="custom-control custom-checkbox padding-top-10">
            <input type="checkbox" className="custom-control-input" id="drplan.remove.checkpoint" name="drplan.remove.checkpoint" checked={remove} onChange={handleChange} />
            <label className="custom-control-label" htmlFor="drplan.remove.checkpoint">
              {t('title.pplan.delete.checkpoint')}
            </label>
          </div>
        </>
      ) : null}
    </>
  );
}

function mapStateToProps(state) {
  const { jobs } = state;
  return { jobs };
}

export default connect(mapStateToProps)(withTranslation()(withRouter(DeletCheckpointPlanCheckbox)));
