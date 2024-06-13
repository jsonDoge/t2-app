import React, { useState } from 'react';
import { toSentenceCase } from '../utils';

import Button from './button';

interface Props {
  title: string;
  seedTypes: string[];
  description: string;
  confirmText: string | JSX.Element;
  cancelText?: string;
  onConfirm: (seedType: string) => void;
  onCancel?: () => void;
  waterLevel: number;
}

const PlantModal: React.FC<Props> = ({
  title,
  seedTypes,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  waterLevel,
}) => {
  const [seedType, setSeedType] = useState(seedTypes[0]);

  const confirm = () => onConfirm && onConfirm(seedType);

  const cancel = () => onCancel && onCancel();

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-opacity-75 transition-opacity" aria-hidden="true" />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-gray-500">{`Plot water level: ${waterLevel}`}</p>
                  <p>
                    <select
                      onChange={(e) => {
                        setSeedType(e.target.value);
                      }}
                      value={seedType}
                    >
                      {seedTypes.map((v) => (
                        <option key={v} value={v}>
                          {toSentenceCase(v)}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button onClick={confirm}>{confirmText}</Button>
            {onCancel && <Button onClick={cancel}>{cancelText}</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantModal;
