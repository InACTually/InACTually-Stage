/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media
*/

import * as THREE from "three";
import type { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

// ─── Runtime Spark module cache ───────────────────────────────────────────────

type SparkModule = typeof import("@sparkjsdev/spark");

let sparkModulePromise: Promise<SparkModule> | null = null;

async function loadSpark(): Promise<SparkModule> {
	if (!import.meta.client) {
		throw new Error("GaussianSplatManager can only be initialized on the client.");
	}

	if (!sparkModulePromise) {
		sparkModulePromise = import("@sparkjsdev/spark");
	}

	return await sparkModulePromise;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SplatEntry {
	id: string;
	mesh: SplatMesh;
}

export interface SplatLoadOptions {
	url: string;
	id: string;
	position?: THREE.Vector3;
	quaternion?: THREE.Quaternion;
	scale?: number;
	opacity?: number;
	lod?: boolean;
	onLoad?: (mesh: SplatMesh) => void;
}

// ─── GaussianSplatManager ─────────────────────────────────────────────────────

export default class GaussianSplatManager {
	private static instance: GaussianSplatManager | null = null;
	private static initPromise: Promise<GaussianSplatManager> | null = null;

	private m_spark: SparkRenderer;
	private m_scene: THREE.Scene;
	private m_camera: { value: THREE.Camera };
	private m_splats: Map<string, SplatEntry> = new Map();
	private m_spark2: boolean;

	// runtime references to Spark constructors
	private static SparkRendererCtor: SparkModule["SparkRenderer"];
	private static SplatMeshCtor: SparkModule["SplatMesh"];

	private constructor(
		sparkRenderer: SparkRenderer,
		scene: THREE.Scene,
		camera: { value: THREE.Camera },
		spark2: boolean,
	) {
		this.m_spark = sparkRenderer;
		this.m_scene = scene;
		this.m_camera = camera;
		this.m_spark2 = spark2;

		this.m_camera.value.add(this.m_spark);

		console.log(
			`[GaussianSplatManager] SparkRenderer ready (Spark ${this.m_spark2 ? "2.x" : "1.x"})`,
		);
	}

	public static async init(
		threeRenderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: { value: THREE.Camera },
	): Promise<GaussianSplatManager> {
		if (GaussianSplatManager.instance) {
			return GaussianSplatManager.instance;
		}

		if (GaussianSplatManager.initPromise) {
			return GaussianSplatManager.initPromise;
		}

		GaussianSplatManager.initPromise = (async () => {
			const spark = await loadSpark();

			GaussianSplatManager.SparkRendererCtor = spark.SparkRenderer;
			GaussianSplatManager.SplatMeshCtor = spark.SplatMesh;

			const spark2 =
				typeof (spark.SplatMesh.prototype as any).enableLod === "function";

			const sparkRenderer = new spark.SparkRenderer({
				renderer: threeRenderer,
				preUpdate: false,
				autoUpdate: true,
			});

			const manager = new GaussianSplatManager(
				sparkRenderer,
				scene,
				camera,
				spark2,
			);

			GaussianSplatManager.instance = manager;
			return manager;
		})();

		return GaussianSplatManager.initPromise;
	}

	public static getInstance(): GaussianSplatManager {
		if (!GaussianSplatManager.instance) {
			throw new Error(
				"GaussianSplatManager has not been initialized yet. Call GaussianSplatManager.init(...) first.",
			);
		}
		return GaussianSplatManager.instance;
	}

	public static isInitialized(): boolean {
		return GaussianSplatManager.instance !== null;
	}

	public load(options: SplatLoadOptions): SplatMesh {
		const {
			id,
			url,
			position = new THREE.Vector3(0, 0, 0),
			quaternion = new THREE.Quaternion(),
			scale = 1,
			opacity = 1,
			lod = false,
			onLoad,
		} = options;

		if (this.m_splats.has(id)) {
			console.warn(`[GaussianSplatManager] Splat "${id}" already exists – replacing.`);
			this.remove(id);
		}

		const ctorOptions: Record<string, unknown> = {
			url,
			onLoad: (m: SplatMesh) => {
				console.log(`[GaussianSplatManager] Splat loaded: ${id}`);
				onLoad?.(m);
			},
		};

		if (lod && this.m_spark2) {
			ctorOptions.lod = true;
		}

		const mesh = new GaussianSplatManager.SplatMeshCtor(ctorOptions as any) as SplatMesh;

		if (opacity !== 1 && "opacity" in mesh) {
			(mesh as any).opacity = opacity;
		}

		if (lod && !this.m_spark2 && "lod" in mesh) {
			(mesh as any).lod = true;
		}

		mesh.position.copy(position);
		mesh.quaternion.copy(quaternion);
		mesh.scale.setScalar(scale);

		if (!this.m_scene.children.includes(this.getSparkRenderer())) {
			this.m_scene.add(this.getSparkRenderer());
		}

		this.m_scene.add(mesh);
		this.m_splats.set(id, { id, mesh });

		console.log(`[GaussianSplatManager] Splat queued: ${id} → ${url}`);
		return mesh;
	}

	public remove(id: string): void {
		const entry = this.m_splats.get(id);
		if (!entry) {
			console.warn(`[GaussianSplatManager] No splat with id "${id}".`);
			return;
		}
		this.m_scene.remove(entry.mesh);
		this.m_splats.delete(id);
	}

	public get(id: string): SplatMesh | undefined {
		return this.m_splats.get(id)?.mesh;
	}

	public setOpacity(id: string, opacity: number): void {
		const entry = this.m_splats.get(id);
		if (entry && "opacity" in entry.mesh) {
			(entry.mesh as any).opacity = opacity;
		}
	}

	public setPosition(id: string, position: THREE.Vector3): void {
		this.m_splats.get(id)?.mesh.position.copy(position);
	}

	public setVisible(id: string, visible: boolean): void {
		const entry = this.m_splats.get(id);
		if (entry) entry.mesh.visible = visible;
	}

	public update(): void {
		if (!this.m_spark.autoUpdate) {
			this.m_spark.update({ scene: this.m_scene, camera: this.m_camera.value });
		}
	}

	public dispose(): void {
		this.m_splats.forEach((_e, id) => this.remove(id));
		this.m_camera.value.remove(this.m_spark);

		GaussianSplatManager.instance = null;
		GaussianSplatManager.initPromise = null;
	}

	public getSparkRenderer(): SparkRenderer {
		return this.m_spark;
	}

	public getSplatIds(): string[] {
		return Array.from(this.m_splats.keys());
	}
}