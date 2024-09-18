import React from 'react';
import { Flex, Radio, Spinner, Tooltip } from '@patternfly/react-core';
import { updateStorageClassConfig } from '~/services/StorageClassService';

interface StorageClassDefaultRadioProps {
  storageClassName: string;
  isChecked: boolean;
  isDisabled: boolean;
  onChange: () => Promise<void>;
}

export const StorageClassDefaultRadio: React.FC<StorageClassDefaultRadioProps> = ({
  storageClassName,
  isChecked: isInitialChecked,
  isDisabled,
  onChange,
}) => {
  const [isChecked, setIsChecked] = React.useState(isInitialChecked);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const id = `${storageClassName}-default-radio`;

  // Update checked state when updating isChecked from parent component
  React.useEffect(() => {
    setIsChecked(isInitialChecked);
  }, [isInitialChecked]);

  const update = React.useCallback(async () => {
    setIsUpdating(true);

    try {
      await updateStorageClassConfig(storageClassName, { isDefault: true });
      await onChange();
    } finally {
      setIsUpdating(false);
    }

    setIsChecked(true);
  }, [storageClassName, onChange]);

  const radioInput = React.useMemo(
    () => (
      <Radio
        id={id}
        name={id}
        data-testid="set-default-radio"
        label="Set as default"
        isChecked={isChecked}
        isDisabled={isDisabled || isUpdating}
        onChange={update}
      />
    ),
    [id, isChecked, isDisabled, isUpdating, update],
  );

  return (
    <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
      {isDisabled ? (
        <Tooltip content="Enable this class to set it as the default.">{radioInput}</Tooltip>
      ) : (
        radioInput
      )}

      <Spinner
        size="md"
        aria-label="Loading default radio selection"
        style={{ visibility: isUpdating ? 'visible' : 'hidden' }}
      />
    </Flex>
  );
};
