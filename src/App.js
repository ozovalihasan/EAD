/* eslint-disable no-console */
/* eslint-disable react/no-this-in-sfc */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';
import Factory from './Factory';

const InnerList = ({
  column, taskMap, index, isDropDisabled,
}) => useMemo(() => {
  const tasks = column.taskIds.map((taskId) => taskMap[taskId]);

  return (
    <Column column={column} tasks={tasks} index={index} isDropDisabled={isDropDisabled} />
  );
},
[column, taskMap, index]);

InnerList.propTypes = {
  column: PropTypes.shape().isRequired,
  taskMap: PropTypes.shape().isRequired,
  isDropDisabled: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [idCount, setIdCount] = useState(0);

  const idCountIncrease = () => {
    setIdCount(idCount + 1);
  };
  // const onDragStart = () => {
  //   document.body.style.color = 'orange';
  //   document.body.style.transition = 'background-color 0.2s ease';
  // };

  // const onDragUpdate = (update) => {
  //   const { destination } = update;
  //   const opacity = destination
  //     ? destination.index / Object.keys(data.tasks).length
  //     : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // };
  const onDragStart = (start) => {
    const homeIndex = data.columnOrder.indexOf(start.source.droppableId);

    setData({
      ...data,
      homeIndex,
    });
  };
  const onDragEnd = (result) => {
    const {
      destination, source, draggableId, type,
    } = result;
    // eslint-disable-next-line no-console

    setData({
      ...data,
      homeIndex: null,
    });
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    if (type === 'task' && destination.droppableId === 20) {
      return;
    }

    if (type === 'task' && source.droppableId === 20) {
      const foreign = data.columns[destination.droppableId];

      const finishTaskIds = Array.from(foreign.taskIds);
      finishTaskIds.splice(destination.index, 0, idCount);

      const newFinish = {
        ...foreign,
        taskIds: finishTaskIds,
      };

      const rows = [
        { id: 'has_many', content: 'has_many' },
        { id: 'has_one', content: 'has_one' },
        { id: 'belongs_to', content: 'belongs_to' },
        { id: 'entity', content: 'entity' },
      ];

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newFinish.id]: newFinish,
        },
        tasks: {
          ...data.tasks,
          [idCount.toString()]: {
            ...rows[source.index],
            id: idCount.toString(),
          },
        },
      };
      setData(newData);
      idCountIncrease();
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newData);
      return;
    }

    const home = data.columns[source.droppableId];
    const foreign = data.columns[destination.droppableId];

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...home,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    const startTaskIds = Array.from(home.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...home,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(foreign.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...foreign,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newData);
  };

  return (
    <div className="App">
      <DragDropContext
        onDragStart={onDragStart}
        // onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >

        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >

          {(provided) => (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Factory
                isDropDisabled
              />
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];

                const isDropDisabled = index < data.homeIndex;
                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={data.tasks}
                    isDropDisabled={isDropDisabled}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const Container = styled.div`
  display: flex;
`;

export default App;
