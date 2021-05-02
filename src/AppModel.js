/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable react/no-this-in-sfc */
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowsAlt, faExpandAlt, faCompressAlt, faEllipsisH, faEllipsisV, faFlag,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Model from './Model';
import {
  removeItem,
  addItem,
  moveItem,
  updateDraggedItemId,
} from './redux';
import saveJSON from './saveJSON';

library.add(faArrowsAlt, faExpandAlt, faCompressAlt, faEllipsisH, faEllipsisV, faFlag);

const AppModel = () => {
  const items = useSelector((state) => state.block.items);

  const [idCount, setIdCount] = useState(
    Math.max(...Object.keys(items).map((item) => parseInt(item, 10))) + 1,
  );

  const idCountIncrease = () => {
    setIdCount((prevIdCount) => prevIdCount + 1);
  };

  const startingId = 0;
  const dispatch = useDispatch();

  const onDragStart = (result) => {
    dispatch(updateDraggedItemId(result.draggableId));
  };
  const onDragEnd = (result) => {
    dispatch(updateDraggedItemId(-1));
    const {
      destination, draggableId, source,
    } = result;

    if (!destination) {
      if (!(items[draggableId].factory)) {
        dispatch(removeItem(source.droppableId, source.index, draggableId));
      }
      return;
    }

    if (items[draggableId].factory) {
      dispatch(addItem(draggableId, destination.droppableId, destination.index, idCount));
      if (items[draggableId].association) {
        const entityId = 7;
        dispatch(addItem(entityId, idCount, destination.index, idCount + 1));
        idCountIncrease();
      }
      idCountIncrease();
      return;
    }
    dispatch(moveItem(
      draggableId,
      destination.droppableId,
      destination.index,
      source.droppableId,
      source.index,
    ));
  };

  return (
    <App className="App">
      <button
        onClick={() => saveJSON(items, 'EAD.json')}
        type="button"
      >
        Download EAD
      </button>
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Droppable
          droppableId="OuterDrop"
          direction="vertical"
          isDropDisabled
        >

          { (provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Model
                id={startingId}
                item={items[startingId]}
                allItems={items}
                index={startingId}
              />
              {provided.placeholder}
            </div>
          )}

        </Droppable>
      </DragDropContext>
    </App>
  );
};

const App = styled.div`
  font-family: Arial, Helvetica, sans-serif;
`;

export default AppModel;
