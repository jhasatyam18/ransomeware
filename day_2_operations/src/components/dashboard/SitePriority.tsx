import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, ListGroup, ListGroupItem, CardBody, Card, Container, Collapse } from 'reactstrap';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect, useSelector } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AppDispatch } from '../../store';
import { areListsEqual, fetchSites, initializeSiteLists, setPrioritySite } from '../../store/actions/siteAction';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { hasPriviledges } from '../../utils/apiUtils';

interface Word {
    ref: string;
    name: string;
}
interface SitePriorityProps extends WithTranslation {
    user: UserInterface;
    dispatch: AppDispatch;
    sites: any;
}

const SitePriority: React.FC<SitePriorityProps> = ({ user, dispatch, sites, t }) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [currentWords, setCurrentWords] = useState<Word[]>([]);
    const [availableWords, setAvailableWords] = useState<Word[]>([]);
    const [initialSelected, setInitialSelected] = useState<Word[]>([]);
    const [initialUnselected, setInitialUnselected] = useState<Word[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [searchTerm] = useState<string>('');
    const [isOpen, setIspen] = useState(false);
    const refresh = useSelector((state: any) => state.global.context.refresh);
    let priviledges = hasPriviledges();
    useEffect(() => {
        if (Array.isArray(sites.sites) && sites.sites.length > 0) {
            const { unselectedSites, selectedSites } = initializeSiteLists(sites.sites);
            setCurrentWords([...unselectedSites]);
            setAvailableWords(selectedSites);
            // store original lists for reset comparison
            setInitialUnselected(unselectedSites);
            setInitialSelected(selectedSites);
        }
    }, [sites, refresh]);

    useEffect(() => {
        dispatch(fetchSites());
    }, [refresh]);

    const toggle = () => {
        setIspen((prev) => !prev);
    };

    const handleSave = () => {
        let payload: any[] = [];
        if (availableWords.length > 0) {
            payload = availableWords.map((site, index) => ({
                ID: site.ref,
                priority: index + 1,
            }));
        }
        dispatch(setPrioritySite(payload));
    };

    const handleReset = () => {
        if (Array.isArray(sites.sites) && sites.sites.length > 0) {
            const { unselectedSites, selectedSites } = initializeSiteLists(sites.sites);
            setCurrentWords([...unselectedSites]);
            setAvailableWords(selectedSites);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLElement>, index: number) => {
        setDraggedIndex(index);
        setIsDragging(true);
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        // Create a copy of the element
        const dragImage = target.cloneNode(true) as HTMLElement;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px'; // move off-screen
        dragImage.style.left = '-1000px';
        dragImage.style.width = `${rect.width}px`;
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);
        // Clean up after short delay
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
    };

    const handleDragEnter = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        const updatedList = [...availableWords];
        const draggedItem = updatedList[draggedIndex];
        updatedList.splice(draggedIndex, 1);
        updatedList.splice(index, 0, draggedItem);
        setDraggedIndex(index);
        setAvailableWords(updatedList);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setIsDragging(false);
    };

    const renderIcon = () => {
        return (
            <div className="wizard-header-options">
                <div className="wizard-header-div">{isOpen ? <FontAwesomeIcon style={{ cursor: 'pointer' }} size="sm" icon={faChevronDown} onClick={toggle} /> : <FontAwesomeIcon style={{ cursor: 'pointer' }} size="sm" icon={faChevronRight} onClick={toggle} />}</div>
            </div>
        );
    };

    const moveItem = (item: Word, from: Word[], to: Word[], setFrom: React.Dispatch<React.SetStateAction<Word[]>>, setTo: React.Dispatch<React.SetStateAction<Word[]>>) => {
        setFrom(from.filter((i) => i.ref !== item.ref));
        setTo([...to, item]);
    };

    const filteredAvailable = availableWords.filter((word) => word.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderSitesPriority = () => {
        if (!sites.sites || sites.sites.length === 0) {
            return <p className="text-center">{t('no.sites.to.display')}</p>;
        }
        return (
            <>
                <Row className="ms-4 me-4 mb-3 pt-3" style={{ minHeight: '300px' }}>
                    <Col md={5}>
                        <p>{t('site.ranking')}</p>
                        <ListGroup>
                            {currentWords.length > 0 ? (
                                currentWords.map((word) => (
                                    <ListGroupItem style={{ cursor: 'pointer' }} key={word.ref} action onClick={() => moveItem(word, currentWords, availableWords, setCurrentWords, setAvailableWords)}>
                                        {word.name}
                                    </ListGroupItem>
                                ))
                            ) : (
                                <Card style={{ minHeight: '150px' }}>
                                    <CardBody>
                                        <p>-</p>
                                    </CardBody>
                                </Card>
                            )}
                        </ListGroup>
                    </Col>

                    <Col md={2} className="d-flex flex-column align-items-center justify-content-start mt-5">
                        <Button
                            color="primary"
                            onClick={() => {
                                if (currentWords.length) {
                                    moveItem(currentWords[0], currentWords, availableWords, setCurrentWords, setAvailableWords);
                                }
                            }}
                        >
                            &gt;&gt;
                        </Button>
                        <Button
                            className="mt-2"
                            color="secondary"
                            onClick={() => {
                                if (availableWords.length) {
                                    moveItem(availableWords[0], availableWords, currentWords, setAvailableWords, setCurrentWords);
                                }
                            }}
                        >
                            &lt;&lt;
                        </Button>
                    </Col>

                    <Col md={5}>
                        <Row>
                            <Col sm={10}>
                                <p>{t('label.preferred.sites')}</p>
                            </Col>
                            <Col sm={2}>
                                <p>{t('label.preference')}</p>
                            </Col>
                        </Row>
                        <ListGroup>
                            {filteredAvailable.length > 0 ? (
                                filteredAvailable.map((word, index) => (
                                    <ListGroupItem style={{ backgroundColor: draggedIndex === index ? '#adb6beff' : '', cursor: isDragging ? 'grabbing' : 'grab' }} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={() => handleDragEnter(index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()} key={word.ref} action onClick={() => moveItem(word, availableWords, currentWords, setAvailableWords, setCurrentWords)}>
                                        <Row>
                                            <Col sm={11}>{word.name}</Col>
                                            <Col sm={1}>
                                                <span className="text-muted">{index + 1}</span>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                ))
                            ) : (
                                <Card style={{ minHeight: '150px' }}>
                                    <CardBody>
                                        <p>-</p>
                                    </CardBody>
                                </Card>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
                {renderFooter()}
            </>
        );
    };

    const renderFooter = () => {
        return (
            <div className="d-flex justify-content-end mb-3 pr-5">
                <div className="me-3">
                    <button type="button" className="btn btn-success me-1" onClick={handleSave} disabled={!priviledges}>
                        {t('Save')}
                    </button>
                    <button disabled={(areListsEqual(availableWords, initialSelected) && areListsEqual(currentWords, initialUnselected, true)) || !priviledges} type="button" className="btn btn-secondary" onClick={handleReset}>
                        {t('Reset')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <Row className="mb-0">
                        <Col sm={6}>
                            <DMBreadCrumb links={[{ label: 'Dashboard Setting', link: '#' }]} />
                        </Col>
                    </Row>
                    <br />

                    <div className="border pt-3 pb-3">
                        <Row>
                            <Col sm={6}>
                                <p aria-hidden className="text-primary ms-3" style={{ fontSize: '15px', cursor: 'pointer' }} onClick={toggle}>
                                    {t('site.priority')}
                                </p>
                            </Col>
                            <Col sm={6} className="d-flex flex-row-reverse">
                                {renderIcon()}
                            </Col>
                        </Row>
                        <Row className="ms-1">
                            <Col>
                                <span className="dashboard_rec_heading_size">{t('site.priority.msg')}</span>
                            </Col>
                        </Row>
                        {isOpen ? <hr /> : null}
                        <Collapse isOpen={isOpen}>{renderSitesPriority()}</Collapse>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, sites } = state;
    return {
        user,
        sites,
    };
}

export default connect(mapStateToProps)(withTranslation()(SitePriority));
