import { useStore } from '@/zustandStore';
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectName } from '../ProjectName';

let renderReadyComponent: JSX.Element;

beforeEach(() => {
    
  useStore.setState({ 
    projectName: "",
    onChangeProjectName: jest.fn()
  })
    
  renderReadyComponent = (
    <ProjectName />
  );
});

describe('<ProjectName />', () => {
  it('displays the correct initial project name', () => {
    render(renderReadyComponent);
    const inputElement = screen.getByPlaceholderText('EAD(default)') as HTMLInputElement;
    expect(inputElement.value).toBe("");
  });

  it('calls onChangeProjectName when input value changes', () => {
    render(renderReadyComponent);
    const inputElement = screen.getByPlaceholderText('EAD(default)') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'New Project' } });
    expect(useStore.getState().onChangeProjectName).toHaveBeenCalledWith('New Project');
  });

 
  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );

    expect(renderedContainer).toMatchSnapshot();
  });
});