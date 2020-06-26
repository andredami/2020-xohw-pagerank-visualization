/**
 * Contributor: Gabriele Bonzi <gabriele.bonzi@mail.polimi.it>
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, AfterViewInit, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { Node, isNode } from 'src/app/model/node/node.model';
import { Edge } from 'src/app/model/edge/edge.model';
import { forceAttract } from 'd3-force-attract';
import { Subject, concat, of, EMPTY, Subscription } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { CONFIGURATION } from 'src/app/app.config';

const FORCES = {
  LINK_STIFFNESS: 0.40,
  LINK_LENGTH_HEIGHT_RATIO: 1 / 6,
  COLLISION_DAMPING: 0.6,
  ELECTRIC: -500,
  CENTER_PULL: 0.1,
  OVERALL_DECAY: 0.6,
};

const GRAPHICS = {
  WINDOW_MARGIN: 50,

  NODE_R: 8,
  NODE_PADDING: 0,
  NODE_NORMAL_STYLE: '#ddd',
  NODE_SELECTED_STYLE: '#f88',
  NODE_BORDER_COLOR: '#000',
  NODE_ROOT_COLOR: 'red',
  NODE_OPACITY: 0.8,

  EDGE_THICKNESS: 1,
  EDGE_STYLE: 'black',
  EDGE_OPACITY: 0.2,

  TEXT_X_OFFSET: 2,
  DEFAULT_OPACITY: 1
};

enum ACTION { ADD, REMOVE }

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnChanges, AfterViewInit {

  // event for toggling a selection of a node
  @Output() select: EventEmitter<Node> = new EventEmitter<Node>();
  @Input() nodes: Node[] = [];
  @Input() selectedNodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @ViewChild('graphContainer') graphContainer;

  private simulation = d3.forceSimulation();
  private renderingQueue = new Subject<{action: ACTION, node: Node}>();
  private renderingSub: Subscription;

  constructor() { }

  public viewPort = { width: 1920, height: 1080 };
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.disableRendering();

    this.viewPort.width = event.target.innerWidth - GRAPHICS.WINDOW_MARGIN;
    this.viewPort.height = event.target.innerHeight - GRAPHICS.WINDOW_MARGIN;

    this.enableRendering();
    this.scheduleRenderActions(true);
  }

  ngOnInit() {
    this.enableRendering();
  }

  private enableRendering() {
    if (this.renderingQueue === undefined) {
      this.renderingQueue = new Subject<{action: ACTION, node: Node}>();
    }

    this.renderingSub = this.renderingQueue.pipe(
      concatMap((renderAction) => {
        return concat(
          of(renderAction),
          EMPTY.pipe(
            delay(1000 / CONFIGURATION.RENDERING.FPS)
          ),
        );
      })
    ).subscribe(this.doRender.bind(this));
  }

  private disableRendering() {
    this.renderingSub.unsubscribe();
    this.renderingQueue = undefined;
  }

  private doRender(renderAction?: {action: ACTION, node: Node}) {
    const nodes: Node[] = this.simulation.nodes().filter(isNode);

    if (renderAction) {

      const nodeAtRandomCoords = {
        ...renderAction.node,
        x: Math.floor(Math.random() * this.viewPort.width),
        y: Math.floor(Math.random() * this.viewPort.width),
      };

      let updatedNodes: Node[];

      switch (renderAction.action) {
        case ACTION.ADD:
          updatedNodes = nodes.concat([nodeAtRandomCoords]);
          break;
        case ACTION.REMOVE:
          updatedNodes = setMinusSet(nodes, [renderAction.node], 'id');
          break;
        default:
          return;
      }

      this.simulation.nodes(updatedNodes);
    }

    const edges =
      this.edges
        .map(edge => ({
          source: nodes.find((node) => node.id === edge.source),
          target: nodes.find((node) => node.id === edge.target),
        }))
        .filter(edge => (edge.source !== undefined && edge.target !== undefined));

    this.simulation
      .force('charge', d3.forceManyBody()
        .strength(() => FORCES.ELECTRIC)
      )
      .force('link', d3.forceLink(edges)
        .strength(FORCES.LINK_STIFFNESS)
        .distance(this.viewPort.height * FORCES.LINK_LENGTH_HEIGHT_RATIO)
      )
      .force('collide', d3.forceCollide(() => GRAPHICS.NODE_PADDING)
        .strength(FORCES.COLLISION_DAMPING)
        .radius(() => GRAPHICS.NODE_R)
        .iterations(2)
      )
      .force('attract', forceAttract()
        .target([this.viewPort.width / 2, this.viewPort.height / 2])
        .strength(FORCES.CENTER_PULL)
      )
      .velocityDecay(FORCES.OVERALL_DECAY)
      .on('tick', this.drawGraph.bind(this))
      .restart();
  }

  ngAfterViewInit() {

    // enable dragging
    d3.select(this.graphContainer.nativeElement)
      .call(d3.drag()
        .container(this.graphContainer.nativeElement).subject(this.dragsubject)
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended));

    // enable selecting
    d3.select(this.graphContainer.nativeElement)
      .on('click', this.selectNode);
  }

  private selectNode = () => {
    const point = d3.mouse(this.graphContainer.nativeElement);
    const node = this.simulation.find(point[0], point[1], GRAPHICS.NODE_R * 2) as Node;

    if (node) { this.select.emit(node); }
  }

  private dragsubject = () => {
    return this.simulation.find(d3.event.x, d3.event.y);
  }

  private dragstarted = () => {
    if (!d3.event.active) { this.simulation.alphaTarget(1).restart(); }
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  private dragged = () => {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  private dragended = () => {
    if (!d3.event.active) { this.simulation.alphaTarget(0); }
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (!changes.nodes) { return ; }

    this.scheduleRenderActions();
  }

  private scheduleRenderActions(force: boolean = false) {
    const nodes = this.simulation.nodes().filter(isNode);

    const nodesToAdd = setMinusSet(this.nodes, nodes, 'id').map(node => ({ ...node }));
    const nodesToRemove = setMinusSet(nodes, this.nodes , 'id').map(node => ({ ...node }));

    nodesToRemove.forEach((n) => {
      this.renderingQueue.next({action: ACTION.REMOVE, node: { ...n }});
    });

    nodesToAdd.forEach((n) => {
      this.renderingQueue.next({action: ACTION.ADD, node: { ...n }});
    });

    if (force && nodesToAdd.length <= 0 && nodesToRemove.length <= 0) {
      this.doRender();
    }
  }

  private drawGraph() {
    const graph = this.getGraph();
    const selectedNodesIds = new Set(this.getGraph().selectedNodes.map(n => n.id));
    const context = this.graphContainer.nativeElement.getContext('2d');

    context.clearRect(0, 0, this.viewPort.width, this.viewPort.height);
    context.save();

    // Edges;
    context.beginPath();
    graph.edges.forEach(drawLink);
    context.lineWidth = GRAPHICS.EDGE_THICKNESS;
    context.strokeStyle = GRAPHICS.EDGE_STYLE;
    context.globalAlpha = GRAPHICS.EDGE_OPACITY;
    context.stroke();
    context.globalAlpha = GRAPHICS.DEFAULT_OPACITY;

    // Circles;
    graph.nodes.forEach(drawNode);

    // Highlight the selected
    context.beginPath();
    graph.selectedNodes.forEach(drawTarget);
    context.lineWidth = GRAPHICS.NODE_R / 2;
    context.strokeStyle = GRAPHICS.NODE_SELECTED_STYLE;
    context.stroke();

    context.fillStyle = 'black';
    context.font = '16px sans-serif';
    context.textBaseline = 'middle';
    graph.nodes.forEach(writeText);

    context.restore();

    function drawLink(d) {
      context.moveTo(d[0].x, d[0].y);
      context.lineTo(d[1].x, d[1].y);
    }

    function drawNode(d: Node) {
      context.beginPath();
      context.arc(d.x, d.y, GRAPHICS.NODE_R, 0, 2 * Math.PI);
      // Border;
      context.strokeStyle = GRAPHICS.NODE_BORDER_COLOR;
      context.stroke();
      // Fill;
      context.globalAlpha = GRAPHICS.NODE_OPACITY;
      if (!selectedNodesIds.has(d.id)) {
        context.fillStyle = GRAPHICS.NODE_NORMAL_STYLE;
      } else {
        context.fillStyle = GRAPHICS.NODE_ROOT_COLOR;
      }
      context.fill();
      context.globalAlpha = GRAPHICS.DEFAULT_OPACITY;
    }

    function drawTarget(d) {
      context.moveTo(d.x + GRAPHICS.NODE_R, d.y);
      context.arc(d.x, d.y, GRAPHICS.NODE_R / 2 * 3, 0, 2 * Math.PI);
    }

    function writeText(d) {
      context.fillText(d.id, d.x + GRAPHICS.NODE_R + GRAPHICS.TEXT_X_OFFSET, d.y);
    }
  }


  private getGraph() {
    const nodes = this.simulation.nodes().filter(isNode);
    const selectedNodes =
      nodes.filter(node => this.selectedNodes.map(selectedNode => selectedNode.id).includes(node['id'])).map(n => ({ ...n }));

    const edges = this.edges.map(edge => {
      return [
        nodes.find(node => node.id === edge.source),
        nodes.find(node => node.id === edge.target),
      ];
    }).filter(edge => edge[0] !== undefined && edge[1] !== undefined);
    return { nodes, edges, selectedNodes };
  }

}

function setMinusSet<T>(a: T[], b: T[], on: keyof T): T[] {
  return a.filter(ael => !b.map(bel => bel[on]).includes(ael[on]));
}
